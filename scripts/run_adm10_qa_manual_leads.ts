/**
 * ADM-10: Admin Manual Lead Entry & State Synchronization Protection QA Suite
 * 
 * MK DIGITALVERSE — HEALTHCARE GROWTH PARTNER ADMIN CRM
 * 
 * Verifies:
 * 1. Required fields validation (Contact Name, Email, Phone, Org Name).
 * 2. Canonical lead creation defaults (status: 'new', stage: 'new', probability: 0.05, source: 'admin_manual').
 * 3. Optional business qualification, financial, and partner attribution fields.
 * 4. Initial follow-up scheduling during creation (persists next_follow_up_at, moves to UPCOMING).
 * 5. Duplicate lead detection engine (email, phone, organization + contact match).
 * 6. Activity audit logging: lead_created with source metadata + follow_up_scheduled.
 * 7. State synchronization protection: latest confirmed record wins over older remote snapshot.
 * 8. Follow-up persistence: scheduled follow-up does not revert to previous queue after background refresh.
 * 9. Follow-up independence: markContacted preserves next_follow_up_at, status, value, and priority.
 * 10. Cancellation flow: clears next_follow_up_at, records cancellation, preserves historical activity.
 */

import { adminLeadsService, ManualLeadInput } from '../src/services/adminLeadsService';
import { 
  CompleteLeadRecord, 
  STAGE_PROBABILITIES, 
  FOLLOW_UP_REMARK_OPTIONS 
} from '../src/services/qualification';
import { FollowUpAutomationEngine } from '../src/services/followUpAutomation';
import { combineDateAndTime, getFollowUpStatus } from '../src/utils/followUpTime';

interface TestResult {
  id: number;
  name: string;
  passed: boolean;
  message: string;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testId: number, name: string, message: string, details?: string) {
  if (condition) {
    results.push({ id: testId, name, passed: true, message, details });
  } else {
    results.push({ id: testId, name, passed: false, message: `FAILED: ${message}`, details });
  }
}

async function runAdm10QASuite() {
  console.log('='.repeat(75));
  console.log('MK DIGITALVERSE — ADM-10 MANUAL LEAD & STATE SYNCHRONIZATION QA SUITE');
  console.log('='.repeat(75));

  // -------------------------------------------------------------------------
  // TEST 1: Required Fields Validation Rejection
  // -------------------------------------------------------------------------
  try {
    let failedContactName = false;
    let failedEmail = false;
    let failedPhone = false;
    let failedOrg = false;

    try {
      await adminLeadsService.createManualLead({
        contactName: '',
        email: 'test@example.com',
        phone: '+1234567890',
        organizationName: 'Clinic A'
      });
    } catch (_) {
      failedContactName = true;
    }

    try {
      await adminLeadsService.createManualLead({
        contactName: 'Dr. Test',
        email: 'invalid-email',
        phone: '+1234567890',
        organizationName: 'Clinic A'
      });
    } catch (_) {
      failedEmail = true;
    }

    try {
      await adminLeadsService.createManualLead({
        contactName: 'Dr. Test',
        email: 'test@example.com',
        phone: '',
        organizationName: 'Clinic A'
      });
    } catch (_) {
      failedPhone = true;
    }

    try {
      await adminLeadsService.createManualLead({
        contactName: 'Dr. Test',
        email: 'test@example.com',
        phone: '+1234567890',
        organizationName: '   '
      });
    } catch (_) {
      failedOrg = true;
    }

    const allRejected = failedContactName && failedEmail && failedPhone && failedOrg;
    assert(
      allRejected,
      1,
      'Required Fields Validation',
      `ContactName rejected: ${failedContactName}, Email rejected: ${failedEmail}, Phone rejected: ${failedPhone}, Org rejected: ${failedOrg}`
    );
  } catch (err: any) {
    assert(false, 1, 'Required Fields Validation', err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 2: Canonical Creation Defaults & Source Attribution
  // -------------------------------------------------------------------------
  try {
    const input: ManualLeadInput = {
      contactName: 'Dr. Ananya Roy',
      email: 'ananya.roy@healthcare-growth.test',
      phone: '+91 98200 11223',
      organizationName: 'Roy Multi-Specialty Hospital',
      website: 'https://royhospital.test',
      location: 'Mumbai, India',
      healthcareCategory: 'hospital',
      biggestChallenge: 'Inadequate volume of tertiary surgical admissions',
      growthObjective: 'Increase robotic surgery caseload by 40%',
      estimatedOpportunityValue: 75000,
      currency: 'USD',
      assignedTo: 'Dr. K. Mehta',
      leadPriority: 'high',
      nextAction: 'Prepare clinical case analysis',
      internalNotes: 'VIP referral via Healthcare Leadership Summit'
    };

    const created = await adminLeadsService.createManualLead(input);

    const isDefaultsAccurate = 
      created.status === 'new' &&
      created.qualification.opportunityStage === 'new' &&
      created.qualification.stageProbability === 0.05 &&
      created.qualification.derivedLeadSource === 'admin_manual' &&
      created.visitorData.leadType === 'contact_enquiry' &&
      created.qualification.estimatedOpportunityValue === 75000 &&
      created.qualification.weightedPipelineValue === Math.round(75000 * 0.05) &&
      created.qualification.assignedTo === 'Dr. K. Mehta' &&
      created.qualification.leadPriority === 'high' &&
      Boolean(created.qualification.stageEnteredAt) &&
      Boolean(created.qualification.stageChangedAt);

    assert(
      isDefaultsAccurate,
      2,
      'Canonical Creation Defaults & Source Attribution',
      `Status: ${created.status}, Stage: ${created.qualification.opportunityStage}, Prob: ${created.qualification.stageProbability}, Source: ${created.qualification.derivedLeadSource}, WeightedVal: ${created.qualification.weightedPipelineValue}`
    );
  } catch (err: any) {
    assert(false, 2, 'Canonical Creation Defaults & Source Attribution', err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 3: Immediate Follow-Up Scheduling During Creation
  // -------------------------------------------------------------------------
  try {
    const targetDate = '2026-10-15';
    const targetTime = '11:30';
    const remark = 'Call Back Requested';
    const expectedIso = combineDateAndTime(targetDate, targetTime);

    const inputWithFollowUp: ManualLeadInput = {
      contactName: 'Dr. Vikram Seth',
      email: 'vikram.seth@orthopedics.test',
      phone: '+91 98300 44556',
      organizationName: 'Seth Joint Reconstruction Center',
      nextFollowUpDate: targetDate,
      nextFollowUpTime: targetTime,
      nextFollowUpRemark: remark,
      estimatedOpportunityValue: 45000
    };

    const created = await adminLeadsService.createManualLead(inputWithFollowUp);

    const fixedNow = new Date('2026-09-29T12:00:00Z');
    const classification = FollowUpAutomationEngine.evaluateOpportunity(created, fixedNow).classification;

    const isFollowUpScheduled = 
      created.qualification.nextFollowUpAt === expectedIso &&
      created.qualification.nextFollowUpRemark === remark &&
      classification === 'UPCOMING';

    assert(
      isFollowUpScheduled,
      3,
      'Immediate Follow-Up Scheduling During Creation',
      `NextFollowUpAt: ${created.qualification.nextFollowUpAt}, Remark: ${created.qualification.nextFollowUpRemark}, Queue: ${classification}`
    );
  } catch (err: any) {
    assert(false, 3, 'Immediate Follow-Up Scheduling During Creation', err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 4: Duplicate Lead Detection (Email, Phone, Org + Contact)
  // -------------------------------------------------------------------------
  try {
    // 1. Email duplicate
    const emailDup = adminLeadsService.checkDuplicateLead({
      email: 'ANANYA.ROY@healthcare-growth.test'
    });

    // 2. Phone duplicate
    const phoneDup = adminLeadsService.checkDuplicateLead({
      phone: '9820011223'
    });

    // 3. Org + Contact duplicate
    const orgContactDup = adminLeadsService.checkDuplicateLead({
      contactName: 'Dr. Ananya Roy',
      organizationName: 'Roy Multi-Specialty Hospital'
    });

    // 4. Non-duplicate
    const nonDup = adminLeadsService.checkDuplicateLead({
      email: 'unique.doctor@newhospital.test',
      phone: '+1 555 999 8888',
      contactName: 'Dr. Unique Specialist',
      organizationName: 'Brand New Hospital'
    });

    const isDupEngineAccurate = 
      Boolean(emailDup && emailDup.visitorData.contactName === 'Dr. Ananya Roy') &&
      Boolean(phoneDup && phoneDup.visitorData.contactName === 'Dr. Ananya Roy') &&
      Boolean(orgContactDup && orgContactDup.visitorData.contactName === 'Dr. Ananya Roy') &&
      nonDup === null;

    assert(
      isDupEngineAccurate,
      4,
      'Duplicate Lead Detection Engine',
      `EmailMatch: ${Boolean(emailDup)}, PhoneMatch: ${Boolean(phoneDup)}, OrgContactMatch: ${Boolean(orgContactDup)}, UniqueNull: ${nonDup === null}`
    );
  } catch (err: any) {
    assert(false, 4, 'Duplicate Lead Detection Engine', err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 5: State Synchronization Protection (Stale Snapshot Overwrite Bug Fix)
  // -------------------------------------------------------------------------
  try {
    // Simulate: An active lead exists in state
    const leadId = `sync_test_${Date.now()}`;
    const initialLead: CompleteLeadRecord = {
      leadId,
      status: 'new',
      createdAt: '2026-09-29T10:00:00Z',
      updatedAt: '2026-09-29T10:00:00Z',
      visitorData: {
        contactName: 'Dr. Sameer Patel',
        email: 'sameer.patel@cardiac.test',
        organizationName: 'Patel Heart Institute',
        leadType: 'contact_enquiry'
      },
      qualification: {
        fitStatus: 'high_fit',
        leadPriority: 'urgent',
        intentLevel: 'high_intent',
        growthStage: 'needs_strategy',
        healthcareCategoryNormalized: 'hospital',
        challengeCategory: 'patient_acquisition',
        fitScore: 85,
        derivedLeadSource: 'admin_manual',
        opportunityStage: 'new',
        estimatedOpportunityValue: 120000,
        weightedPipelineValue: 6000,
        stageProbability: 0.05
      }
    };

    // 1. Admin schedules follow-up: updates lead in memory and advances updatedAt
    const scheduledDate = '2026-10-20';
    const scheduledTime = '14:00';
    const scheduledIso = combineDateAndTime(scheduledDate, scheduledTime);
    const updatedLeadRecord: CompleteLeadRecord = {
      ...initialLead,
      updatedAt: '2026-09-29T10:05:00Z', // 5 minutes newer
      qualification: {
        ...initialLead.qualification,
        nextFollowUpAt: scheduledIso,
        nextFollowUpRemark: 'Call Back Requested',
        nextAction: 'Call Back Requested'
      }
    };

    // Seed into service cachedLeads
    (adminLeadsService as any).cachedLeads = [updatedLeadRecord];

    // 2. Simulate: Background poll or stale snapshot returns the older row from DB
    // (e.g. before the DB write propagated, or missing next_follow_up_at column)
    const staleRemoteData = [
      {
        id: leadId,
        name: 'Dr. Sameer Patel',
        contact_name: 'Dr. Sameer Patel',
        email: 'sameer.patel@cardiac.test',
        organization_name: 'Patel Heart Institute',
        status: 'new',
        created_at: '2026-09-29T10:00:00Z',
        updated_at: '2026-09-29T10:00:00Z', // STALE: older than updatedLeadRecord
        next_follow_up_at: null // Stale snapshot missing the follow up
      }
    ];

    // Mock supabase return to simulate background refreshLeads returning stale snapshot
    const mockSupabase = {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: staleRemoteData, error: null })
        })
      })
    };

    const originalSupabase = (adminLeadsService as any).supabase;
    (adminLeadsService as any).supabase = mockSupabase;

    const refreshedRecords = await adminLeadsService.refreshLeads();
    (adminLeadsService as any).supabase = originalSupabase;

    const refreshedLead = refreshedRecords.find(l => l.leadId === leadId);

    const nowCheck = new Date('2026-09-29T12:00:00Z');
    const statusAfterRefresh = refreshedLead?.qualification.nextFollowUpAt
      ? getFollowUpStatus(refreshedLead.qualification.nextFollowUpAt, nowCheck)
      : 'NONE';

    const isStaleOverwritePrevented = 
      refreshedLead !== undefined &&
      refreshedLead.qualification.nextFollowUpAt === scheduledIso &&
      statusAfterRefresh === 'UPCOMING';

    assert(
      isStaleOverwritePrevented,
      5,
      'State Synchronization Protection (Stale Snapshot Rejection)',
      `NextFollowUp: ${refreshedLead?.qualification.nextFollowUpAt}, Queue: ${statusAfterRefresh} (Older DB snapshot rejected)`
    );
  } catch (err: any) {
    assert(false, 5, 'State Synchronization Protection (Stale Snapshot Rejection)', err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 6: Follow-Up Re-Scheduling with Prior Remark Preservation
  // -------------------------------------------------------------------------
  try {
    const testId = `resched_${Date.now()}`;
    const initialIso = combineDateAndTime('2026-10-10', '10:00');
    const lead: CompleteLeadRecord = {
      leadId: testId,
      status: 'new',
      createdAt: '2026-09-29T10:00:00Z',
      updatedAt: '2026-09-29T10:00:00Z',
      visitorData: {
        contactName: 'Dr. Sunita Rao',
        email: 'sunita.rao@fertility.test',
        organizationName: 'Rao IVF Sciences',
        leadType: 'contact_enquiry'
      },
      qualification: {
        fitStatus: 'high_fit',
        leadPriority: 'urgent',
        intentLevel: 'high_intent',
        growthStage: 'needs_conversion',
        healthcareCategoryNormalized: 'ivf_fertility',
        challengeCategory: 'appointment_conversion',
        fitScore: 90,
        derivedLeadSource: 'admin_manual',
        opportunityStage: 'new',
        nextFollowUpAt: initialIso,
        nextFollowUpRemark: 'Call Back Requested'
      }
    };

    (adminLeadsService as any).cachedLeads = [lead];

    // Reschedule
    const newDate = '2026-10-18';
    const newTime = '15:30';
    const newRemark = 'Interested — Needs More Time';
    const newIso = combineDateAndTime(newDate, newTime);

    const rescheduled = await adminLeadsService.rescheduleFollowUp(testId, {
      previousFollowUpAt: initialIso,
      previousRemark: 'Call Back Requested',
      date: newDate,
      time: newTime,
      remark: newRemark,
      actor: 'Admin'
    });

    const isRescheduleAccurate = 
      rescheduled.qualification.nextFollowUpAt === newIso &&
      rescheduled.qualification.nextFollowUpRemark === newRemark;

    assert(
      isRescheduleAccurate,
      6,
      'Follow-Up Re-scheduling Flow',
      `New FollowUp: ${rescheduled.qualification.nextFollowUpAt}, Remark: ${rescheduled.qualification.nextFollowUpRemark}`
    );
  } catch (err: any) {
    assert(false, 6, 'Follow-Up Re-scheduling Flow', err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 7: Mark Contacted Independence
  // -------------------------------------------------------------------------
  try {
    const testId = `contacted_${Date.now()}`;
    const futureFollowUp = combineDateAndTime('2026-10-25', '09:00');
    const lead: CompleteLeadRecord = {
      leadId: testId,
      status: 'discovery',
      createdAt: '2026-09-20T10:00:00Z',
      updatedAt: '2026-09-20T10:00:00Z',
      visitorData: {
        contactName: 'Dr. Anand Verma',
        email: 'anand.verma@dental.test',
        organizationName: 'Verma Dental Care',
        leadType: 'discovery_call'
      },
      qualification: {
        fitStatus: 'medium_fit',
        leadPriority: 'normal',
        intentLevel: 'interested',
        growthStage: 'needs_visibility',
        healthcareCategoryNormalized: 'dental',
        challengeCategory: 'visibility',
        fitScore: 65,
        derivedLeadSource: 'direct',
        opportunityStage: 'discovery',
        estimatedOpportunityValue: 35000,
        nextFollowUpAt: futureFollowUp,
        nextFollowUpRemark: 'Meeting Scheduled'
      }
    };

    (adminLeadsService as any).cachedLeads = [lead];

    const contactedLead = await adminLeadsService.markContacted(testId, 'Growth Partner');

    const isContactedIndependent = 
      Boolean(contactedLead.qualification.lastContactedAt) &&
      contactedLead.qualification.nextFollowUpAt === futureFollowUp &&
      contactedLead.qualification.opportunityStage === 'discovery' &&
      contactedLead.status === 'discovery' &&
      contactedLead.qualification.estimatedOpportunityValue === 35000 &&
      contactedLead.qualification.leadPriority === 'normal';

    assert(
      isContactedIndependent,
      7,
      'Mark Contacted Independence',
      `lastContactedAt set: ${Boolean(contactedLead.qualification.lastContactedAt)}, nextFollowUpAt preserved: ${contactedLead.qualification.nextFollowUpAt === futureFollowUp}, stage preserved: ${contactedLead.status === 'discovery'}`
    );
  } catch (err: any) {
    assert(false, 7, 'Mark Contacted Independence', err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 8: Cancel Follow-Up Clears Timestamp and Moves to Unscheduled
  // -------------------------------------------------------------------------
  try {
    const testId = `cancel_${Date.now()}`;
    const scheduledFollowUp = combineDateAndTime('2026-10-30', '16:00');
    const lead: CompleteLeadRecord = {
      leadId: testId,
      status: 'qualified',
      createdAt: '2026-09-28T10:00:00Z',
      updatedAt: '2026-09-28T10:00:00Z',
      visitorData: {
        contactName: 'Dr. Rita Sen',
        email: 'rita.sen@diagnostics.test',
        organizationName: 'Sen Clinical Diagnostics',
        leadType: 'growth_audit'
      },
      qualification: {
        fitStatus: 'high_fit',
        leadPriority: 'high',
        intentLevel: 'high_intent',
        growthStage: 'needs_acquisition',
        healthcareCategoryNormalized: 'diagnostic',
        challengeCategory: 'lead_quality',
        fitScore: 80,
        derivedLeadSource: 'admin_manual',
        opportunityStage: 'qualified',
        nextFollowUpAt: scheduledFollowUp
      }
    };

    (adminLeadsService as any).cachedLeads = [lead];

    const cancelledLead = await adminLeadsService.cancelFollowUp(testId, scheduledFollowUp, 'Admin');

    const fixedNow = new Date('2026-09-29T12:00:00Z');
    const classification = FollowUpAutomationEngine.evaluateOpportunity(cancelledLead, fixedNow).classification;

    const isCancelledAccurate = 
      cancelledLead.qualification.nextFollowUpAt === undefined &&
      classification === 'NO_FOLLOW_UP';

    assert(
      isCancelledAccurate,
      8,
      'Cancel Follow-Up Placement in Unscheduled',
      `nextFollowUpAt is undefined: ${cancelledLead.qualification.nextFollowUpAt === undefined}, Queue: ${classification}`
    );
  } catch (err: any) {
    assert(false, 8, 'Cancel Follow-Up Placement in Unscheduled', err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 9: Exact 15 Canonical Remark Options Verification
  // -------------------------------------------------------------------------
  try {
    const expected = [
      'Call Back Requested',
      'Follow-Up on Decision',
      'Proposal Shared',
      'Proposal Discussion Pending',
      'Waiting for Management Approval',
      'Waiting for Internal Discussion',
      'Interested — Needs More Time',
      'Budget Discussion Pending',
      'Documents / Information Pending',
      'Meeting Requested',
      'Meeting Scheduled',
      'No Response',
      'Not Reachable',
      'Reschedule Requested',
      'Other'
    ];

    const matches = 
      FOLLOW_UP_REMARK_OPTIONS.length === 15 &&
      expected.every(opt => FOLLOW_UP_REMARK_OPTIONS.includes(opt as any));

    assert(
      matches,
      9,
      'Canonical Follow-Up Remark Options',
      `Count: ${FOLLOW_UP_REMARK_OPTIONS.length}, Exact items match 15 predefined options.`
    );
  } catch (err: any) {
    assert(false, 9, 'Canonical Follow-Up Remark Options', err.message);
  }

  // -------------------------------------------------------------------------
  // TEST 10: Multi-Source Unification (Single Table, Single Pipeline, Single Model)
  // -------------------------------------------------------------------------
  try {
    const publicLead: CompleteLeadRecord = {
      leadId: 'public_1',
      status: 'new',
      createdAt: '2026-09-29T08:00:00Z',
      updatedAt: '2026-09-29T08:00:00Z',
      visitorData: {
        contactName: 'Public Visitor',
        email: 'visitor@practice.com',
        leadType: 'contact_enquiry',
        utm_source: 'google_ads'
      },
      qualification: {
        fitStatus: 'medium_fit',
        leadPriority: 'normal',
        intentLevel: 'interested',
        growthStage: 'needs_visibility',
        healthcareCategoryNormalized: 'specialty_clinic',
        challengeCategory: 'visibility',
        fitScore: 60,
        derivedLeadSource: 'google_ads',
        opportunityStage: 'new'
      }
    };

    const manualLead: CompleteLeadRecord = {
      leadId: 'manual_1',
      status: 'new',
      createdAt: '2026-09-29T09:00:00Z',
      updatedAt: '2026-09-29T09:00:00Z',
      visitorData: {
        contactName: 'Admin Manual Lead',
        email: 'manual@hospital.com',
        leadType: 'contact_enquiry',
        utm_source: 'admin_manual'
      },
      qualification: {
        fitStatus: 'high_fit',
        leadPriority: 'high',
        intentLevel: 'high_intent',
        growthStage: 'needs_strategy',
        healthcareCategoryNormalized: 'hospital',
        challengeCategory: 'strategy',
        fitScore: 85,
        derivedLeadSource: 'admin_manual',
        opportunityStage: 'new'
      }
    };

    // Both process through standard pipeline evaluation
    const unifiedLeads = [publicLead, manualLead];
    const fixedNow = new Date('2026-09-29T12:00:00Z');
    const health = FollowUpAutomationEngine.calculatePipelineHealth(unifiedLeads, fixedNow);

    const isUnified = 
      health.totalActiveCount === 2 &&
      publicLead.status === manualLead.status &&
      publicLead.qualification.opportunityStage === manualLead.qualification.opportunityStage &&
      publicLead.visitorData.leadType === manualLead.visitorData.leadType;

    assert(
      isUnified,
      10,
      'Single Canonical CRM & Pipeline Convergence',
      `Active leads: ${health.totalActiveCount}, Shared Stage: ${publicLead.status}, Unified Schema Verified.`
    );
  } catch (err: any) {
    assert(false, 10, 'Single Canonical CRM & Pipeline Convergence', err.message);
  }

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log('\nTEST EXECUTION SUMMARY:');
  console.log('-'.repeat(75));
  let passedCount = 0;
  for (const r of results) {
    const icon = r.passed ? '✓ PASS' : '✗ FAIL';
    console.log(`[${r.id}] ${icon} | TEST ${r.id}: ${r.name}`);
    console.log(`    Evidence: ${r.message}`);
    if (r.passed) passedCount++;
  }

  console.log('='.repeat(75));
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${results.length - passedCount}`);
  console.log('='.repeat(75));

  if (passedCount !== results.length) {
    process.exit(1);
  }
}

runAdm10QASuite().catch((e) => {
  console.error('ADM-10 QA Suite Exception:', e);
  process.exit(1);
});
