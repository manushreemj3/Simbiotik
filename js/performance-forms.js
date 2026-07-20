const PerformanceForms = (() => {
  const RATING_SCALE = [
    { score: 5, label: 'Exceptional', desc: 'Performance at this level is clearly unique and far in excess of established expectations.' },
    { score: 4, label: 'Exceeds Expectations', desc: 'Performance at this level often exceeds established expectations and standards of work quality, quantity and timeliness.' },
    { score: 3, label: 'Meets Expectations', desc: 'Performance at this level meets established expectations and standards for work quality, quantity and timeliness.' },
    { score: 2, label: 'Needs Improvement', desc: 'Performance at this level is below the level expected. Improvement is required in significant dimensions of the job.' },
    { score: 1, label: 'Unsatisfactory', desc: 'Performance at this level is unacceptable. The employee often fails to achieve basic requirements of the position.' }
  ];

  const PROBATION_CORE = [
    'Quality of Work: Work is completed accurately (few or no errors), efficiently and within deadlines with minimal supervision',
    'Attendance & Punctuality: Reports for work on time, provides advance notice of need for absence',
    'Reliability/Dependability: Consistently performs at a high level; manages time and workload effectively to meet responsibilities',
    'Communication Skills: Written and oral communications are clear, organized and effective; listens and comprehends well',
    'Judgment & Decision-Making: Makes thoughtful, well-reasoned decisions; exercises good judgment, resourcefulness and creativity in problem-solving',
    'Initiative & Flexibility: Demonstrates initiative, often seeking out additional responsibility; identifies problems and solutions; thrives on new challenges and adjusts to unexpected changes',
    'Cooperation & Teamwork: Respectful of colleagues when working with others and makes valuable contributions to help the group achieve its goals'
  ];

  const PROBATION_JOB = [
    'Knowledge of Position: Possesses required skills, knowledge, and abilities to competently perform the job',
    'Training & Development: Continually seeks ways to strengthen performance and regularly monitors new developments in field of work'
  ];

  const APPRAISAL_KPIS = [
    { kra: 'POLICIES/ PROCEDURES', kpi: 'Meeting deadlines & Delivery Schedules - Based on achievements (Indicate targets, where applicable)' },
    { kra: 'POLICIES/ PROCEDURES', kpi: 'Effort & Quality of work - Based on achievements (Indicate targets, where applicable)' },
    { kra: 'POLICIES/ PROCEDURES', kpi: 'Contribution to the Company - Based on achievements (Indicate targets, where applicable)' },
    { kra: 'PEOPLE / SELF-DEVELOPMENT', kpi: 'Training attended (please indicate if paid on your own)' },
    { kra: 'PEOPLE / SELF-DEVELOPMENT', kpi: 'Attendance & Punctuality' },
    { kra: 'PEOPLE / SELF-DEVELOPMENT', kpi: 'Current improvement areas' },
    { kra: 'PEOPLE / SELF-DEVELOPMENT', kpi: "Other Achievements of prior year's objectives - (Mention any awards or recognitions achieved during the year)" }
  ];

  const RATING_OPTIONS_PROBATION = ['Exceeds expectations', 'Meets expectations', 'Needs improvement', 'Unacceptable'];

  function getReviewType(record) {
    if (!record) return 'probation';
    if (record.reviewType === 'appraisal') return 'appraisal';
    if (record.reviewType === 'probation') return 'probation';
    if ((record.goal || '').toLowerCase().includes('appraisal')) return 'appraisal';
    return 'probation';
  }

  function normalizeName(v) {
    return (v || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function parseLocalDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(`${dateStr}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function addCalendarMonths(date, months) {
    const d = new Date(date.getTime());
    const day = d.getDate();
    d.setMonth(d.getMonth() + months);
    if (d.getDate() !== day) d.setDate(0);
    return d;
  }

  function sameCalendarDay(a, b) {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  /** Probation review period must be exactly 3 or 6 calendar months. */
  function validateProbationPeriod(fromStr, toStr) {
    const from = parseLocalDate(fromStr);
    const to = parseLocalDate(toStr);
    if (!from || !to) return 'Review period from and to dates are required';
    if (to < from) return 'Review period end date must be after the start date';

    const is3 = sameCalendarDay(to, addCalendarMonths(from, 3));
    const is6 = sameCalendarDay(to, addCalendarMonths(from, 6));
    if (!is3 && !is6) {
      return 'Probation review period must be exactly 3 months or 6 months (for example: 01-Jan to 01-Apr, or 01-Jan to 01-Jul)';
    }
    return null;
  }

  function getCurrentAppraisalYearLabel(now = new Date()) {
    const endYear = now.getFullYear();
    const startYear = endYear - 1;
    return `${startYear}-${endYear}`;
  }

  function getAppraisalYearOptions(now = new Date()) {
    const current = getCurrentAppraisalYearLabel(now);
    const endYear = now.getFullYear();
    const previous = `${endYear - 2}-${endYear - 1}`;
    return [current, previous];
  }

  /** Appraisal year must be a 1-year cycle like 2025-2026. */
  function validateAppraisalYear(yearLabel, now = new Date()) {
    const value = (yearLabel || '').trim();
    if (!value) return 'Appraisal year is required (for example: 2025-2026)';
    const match = value.match(/^(\d{4})-(\d{4})$/);
    if (!match) return 'Appraisal year must be in YYYY-YYYY format (for example: 2025-2026)';
    const start = Number(match[1]);
    const end = Number(match[2]);
    if (end !== start + 1) return 'Appraisal year must cover exactly 1 year (for example: 2025-2026)';
    const allowed = getAppraisalYearOptions(now);
    if (!allowed.includes(value)) {
      return `Appraisal year must be a valid cycle. Current cycle is ${getCurrentAppraisalYearLabel(now)}`;
    }
    return null;
  }

  function escHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function lockFormReadOnly(root) {
    if (!root) return;
    root.classList.add('perf-form-readonly');
    root.querySelectorAll('input, select, textarea, button').forEach(el => {
      if (el.id === 'modal-close' || el.id === 'btn-close-perf-view') return;
      el.disabled = true;
      el.setAttribute('disabled', 'disabled');
      if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type !== 'radio' && el.type !== 'checkbox')) {
        el.readOnly = true;
        el.setAttribute('readonly', 'readonly');
      }
      el.tabIndex = -1;
    });
  }

  function ratingSelect(id, required = true, selected = '') {
    const req = required ? 'required' : '';
    return `<select id="${id}" ${req}>
      <option value="" disabled ${!selected ? 'selected' : ''} hidden>—</option>
      ${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${String(selected) === String(n) ? 'selected' : ''}>${n}</option>`).join('')}
    </select>`;
  }

  function employeeLookupHtml(employeeNameOptions) {
    return `
      <div class="form-group perf-emp-lookup">
        <label>Employee Name</label>
        <input type="text" id="perf-emp-name" list="perf-name-list" placeholder="Type or select employee name" autocomplete="off" required />
        <datalist id="perf-name-list">${employeeNameOptions}</datalist>
        <p id="perf-emp-check" class="form-hint perf-emp-check">Start typing employee name to verify.</p>
      </div>
      <input type="hidden" id="perf-emp-id" />`;
  }

  function bindEmployeeLookup(getEmployees, fields = {}) {
    const empNameEl = document.getElementById('perf-emp-name');
    const empIdEl = document.getElementById('perf-emp-id');
    const empCheckEl = document.getElementById('perf-emp-check');
    const designationEl = fields.designationEl ? document.getElementById(fields.designationEl) : null;
    const departmentEl = fields.departmentEl ? document.getElementById(fields.departmentEl) : null;
    const joinDateEl = fields.joinDateEl ? document.getElementById(fields.joinDateEl) : null;
    const jobTitleEl = fields.jobTitleEl ? document.getElementById(fields.jobTitleEl) : null;
    const supervisorEl = fields.supervisorEl ? document.getElementById(fields.supervisorEl) : null;
    const locationEl = fields.locationEl ? document.getElementById(fields.locationEl) : null;

    let lastMatchedId = '';

    const getJobTitle = (match) => match?.designation || match?.role || '';

    const findMatch = (nameInput) => {
      const raw = (nameInput || '').toString().trim();
      const query = normalizeName(raw);
      if (!query) return null;
      const employees = getEmployees();

      let match = employees.find(e => normalizeName(e.name) === query);
      if (match) return match;

      match = employees.find(e => (e.name || '').trim() === raw);
      if (match) return match;

      match = employees.find(e => (e.employeeId || '').toUpperCase() === raw.toUpperCase());
      if (match) return match;

      const prefixMatches = employees.filter(e => normalizeName(e.name).startsWith(query));
      if (prefixMatches.length === 1) return prefixMatches[0];

      return null;
    };

    const fillFromMatch = (match) => {
      if (!match) return null;
      const isNewEmployee = match.employeeId !== lastMatchedId;
      lastMatchedId = match.employeeId || '';

      empNameEl.value = match.name || '';
      empIdEl.value = match.employeeId || '';

      const jobTitle = getJobTitle(match);
      if (designationEl) designationEl.value = jobTitle;
      if (jobTitleEl) jobTitleEl.value = jobTitle;
      if (departmentEl) departmentEl.value = match.department || '';
      if (supervisorEl) supervisorEl.value = match.supervisor || '';
      if (locationEl) locationEl.value = match.workingLocation || locationEl.value || 'Bangalore';
      if (joinDateEl && match.joinDate) {
        const d = new Date(match.joinDate);
        if (!Number.isNaN(d.getTime())) joinDateEl.value = d.toISOString().split('T')[0];
      } else if (joinDateEl && isNewEmployee) {
        joinDateEl.value = '';
      }

      if (empCheckEl) {
        empCheckEl.textContent = `Employee verified: ${match.name} (${match.employeeId})`;
        empCheckEl.classList.remove('invalid');
        empCheckEl.classList.add('verified');
      }
      return match;
    };

    const clearLookup = () => {
      lastMatchedId = '';
      empIdEl.value = '';
      if (empCheckEl) {
        empCheckEl.textContent = 'Start typing employee name to verify.';
        empCheckEl.classList.remove('verified', 'invalid');
      }
    };

    const runLookup = () => {
      const query = empNameEl?.value || '';
      if (!query.trim()) {
        clearLookup();
        return null;
      }
      const match = findMatch(query);
      if (match) return fillFromMatch(match);

      if (lastMatchedId) lastMatchedId = '';
      empIdEl.value = '';
      if (empCheckEl) {
        empCheckEl.textContent = 'No matching employee found yet. Pick a name from suggestions or type the full name.';
        empCheckEl.classList.remove('verified');
        empCheckEl.classList.add('invalid');
      }
      return null;
    };

    empNameEl?.addEventListener('input', runLookup);
    empNameEl?.addEventListener('change', runLookup);
    empNameEl?.addEventListener('blur', () => {
      const query = empNameEl.value || '';
      if (!query.trim()) return;
      const match = findMatch(query);
      if (match) fillFromMatch(match);
      else if (empCheckEl) {
        empCheckEl.textContent = 'Employee does not exist in records.';
        empCheckEl.classList.remove('verified');
        empCheckEl.classList.add('invalid');
      }
    });

    return {
      validate() {
        const employeeId = empIdEl?.value?.trim() || '';
        const employeeName = empNameEl?.value?.trim() || '';
        const match = getEmployees().find(e => e.employeeId === employeeId && normalizeName(e.name) === normalizeName(employeeName));
        return match ? { employeeId, employeeName, match } : null;
      }
    };
  }

  function buildProbationCategoryRow(prefix, category, index, selectedRating = '', comments = '') {
    return `
      <tr>
        <td class="probation-cat-cell">${category}</td>
        <td class="probation-rating-cell">
          <div class="radio-group perf-radio-group">
            ${RATING_OPTIONS_PROBATION.map(option => `
              <label class="probation-radio"><input type="radio" name="${prefix}-rating-${index}" value="${option}" ${selectedRating === option ? 'checked' : ''} /> ${option}</label>
            `).join('')}
          </div>
        </td>
        <td class="probation-comments-cell">
          <textarea id="${prefix}-comment-${index}" class="probation-comment-box" rows="4" placeholder="Add comments/examples (press Enter for a new line)">${escHtml(comments)}</textarea>
        </td>
      </tr>`;
  }

  function buildProbationFormHtml(employeeNameOptions, data = {}, isUpdate = false) {
    const ef = data.evaluationForm || {};
    const employeeBlock = isUpdate ? `
      <div class="form-row">
        <div class="form-group"><label>Employee Name</label><input type="text" value="${data.employeeName || ''}" readonly /></div>
        <div class="form-group"><label>Employee ID</label><input type="text" value="${data.employeeId || ''}" readonly /></div>
      </div>` : employeeLookupHtml(employeeNameOptions);

    const coreRows = PROBATION_CORE.map((c, i) =>
      buildProbationCategoryRow('core', c, i, ef.coreValues?.[i]?.rating, ef.coreValues?.[i]?.comments || '')
    ).join('');

    const jobRows = PROBATION_JOB.map((c, i) =>
      buildProbationCategoryRow('job', c, i, ef.jobCriteria?.[i]?.rating, ef.jobCriteria?.[i]?.comments || '')
    ).join('');

    return `
      <div class="perf-form-shell probation-form">
        <div class="probation-form-header">
          <div>
            <p class="probation-form-title">PROBATION PERFORMANCE REVIEW</p>
            <p class="probation-form-subtitle">Employee evaluation form</p>
          </div>
        </div>

        <h4 class="perf-section-title">I. EMPLOYEE INFORMATION</h4>
        ${employeeBlock}
        <div class="form-row">
          <div class="form-group">
            <label>Job Title</label>
            <input type="text" id="perf-job-title" value="${data.jobTitle || ef.jobTitle || ''}" placeholder="Job title" required />
          </div>
          <div class="form-group">
            <label>Supervisor/Reviewer</label>
            <input type="text" id="perf-reviewer" value="${data.reviewer || ef.reviewer || ''}" placeholder="Supervisor/Reviewer" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Review Period From</label>
            <input type="date" id="perf-review-from" value="${ef.reviewPeriod?.from || ''}" required />
          </div>
          <div class="form-group">
            <label>Review Period To</label>
            <input type="date" id="perf-review-to" value="${ef.reviewPeriod?.to || ''}" required />
          </div>
        </div>
        <p class="form-hint perf-period-hint">Review period must be exactly <strong>3 months</strong> or <strong>6 months</strong> (example: 01 Jan → 01 Apr, or 01 Jan → 01 Jul).</p>

        <h4 class="perf-section-title">II. CORE VALUES AND OBJECTIVES</h4>
        <div class="appraisal-table-wrap">
          <table class="probation-table">
            <thead>
              <tr>
                <th>Performance Category</th>
                <th>Rating</th>
                <th>Comments and Examples</th>
              </tr>
            </thead>
            <tbody>${coreRows}</tbody>
          </table>
        </div>

        <h4 class="perf-section-title">III. JOB-SPECIFIC PERFORMANCE CRITERIA</h4>
        <div class="appraisal-table-wrap">
          <table class="probation-table">
            <thead>
              <tr>
                <th>Performance Category</th>
                <th>Rating</th>
                <th>Comments and Examples</th>
              </tr>
            </thead>
            <tbody>${jobRows}</tbody>
          </table>
        </div>

        <div class="form-group">
          <label>IV. PERFORMANCE GOALS</label>
          <textarea id="perf-goals" rows="4" required>${ef.goals || ''}</textarea>
        </div>
        <div class="form-group">
          <label>V. OVERALL RATING</label>
          <select id="perf-status" required>
            <option value="" disabled ${!data.reviewStatus ? 'selected' : ''} hidden>Select rating</option>
            <option value="EXCEEDS EXPECTATIONS" ${data.reviewStatus === 'EXCEEDS EXPECTATIONS' ? 'selected' : ''}>EXCEEDS EXPECTATIONS</option>
            <option value="MEETS EXPECTATIONS" ${data.reviewStatus === 'MEETS EXPECTATIONS' ? 'selected' : ''}>MEETS EXPECTATIONS</option>
            <option value="NEEDS IMPROVEMENT" ${data.reviewStatus === 'NEEDS IMPROVEMENT' ? 'selected' : ''}>NEEDS IMPROVEMENT</option>
            <option value="UNACCEPTABLE" ${data.reviewStatus === 'UNACCEPTABLE' ? 'selected' : ''}>UNACCEPTABLE</option>
          </select>
        </div>
        <div class="form-group">
          <label>Comment on the employee's overall performance</label>
          <textarea id="perf-notes" rows="4" required>${data.reviewNotes || ef.overallComments || ''}</textarea>
        </div>
      </div>`;
  }

  function buildAppraisalKpiRow(index, row = {}) {
    const showKra = row.showKra !== false;
    return `
      <tr data-kpi-index="${index}">
        <td class="appraisal-kra-cell">${showKra ? (row.kra || APPRAISAL_KPIS[index]?.kra || '') : ''}</td>
        <td class="appraisal-kpi-cell">${row.kpi || APPRAISAL_KPIS[index]?.kpi || ''}</td>
        <td class="appraisal-rating-cell">${ratingSelect(`appraisal-rating-${index}`, true, row.rating || '')}</td>
        <td class="appraisal-remarks-cell">
          <textarea id="appraisal-self-remarks-${index}" rows="5" placeholder="Project details and justification">${row.selfRemarks || ''}</textarea>
        </td>
        <td class="appraisal-rating-cell">${ratingSelect(`appraisal-self-rating-${index}`, true, row.selfRating || '')}</td>
        <td class="appraisal-remarks-cell">
          <textarea id="appraisal-ev1-remarks-${index}" rows="5" placeholder="Evaluator remarks">${row.evaluator1Remarks || ''}</textarea>
        </td>
        <td class="appraisal-rating-cell">${ratingSelect(`appraisal-ev1-rating-${index}`, true, row.evaluator1Rating || '')}</td>
        <td class="appraisal-remarks-cell">
          <textarea id="appraisal-ev2-remarks-${index}" rows="5" placeholder="Evaluator 2 remarks">${row.evaluator2Remarks || ''}</textarea>
        </td>
        <td class="appraisal-rating-cell">${ratingSelect(`appraisal-ev2-rating-${index}`, false, row.evaluator2Rating || '')}</td>
      </tr>`;
  }

  function buildAppraisalFormHtml(employeeNameOptions, data = {}, isUpdate = false) {
    const ef = data.evaluationForm || {};
    const kpiRows = ef.kpiRows || [];
    let lastKra = '';
    const yearOptions = getAppraisalYearOptions();
    const selectedYear = ef.appraisalYear || getCurrentAppraisalYearLabel();

    const employeeBlock = isUpdate ? `
      <div class="form-row">
        <div class="form-group"><label>Employee Name</label><input type="text" value="${data.employeeName || ''}" readonly /></div>
        <div class="form-group"><label>Employee ID</label><input type="text" value="${data.employeeId || ''}" readonly /></div>
      </div>` : employeeLookupHtml(employeeNameOptions);

    const kpiCards = APPRAISAL_KPIS.map((item, index) => {
      const saved = kpiRows[index] || {};
      const showKra = item.kra !== lastKra;
      lastKra = item.kra;
      return buildAppraisalKpiRow(index, { ...item, ...saved, showKra });
    }).join('');

    const ratingGuide = RATING_SCALE.map(r => `
      <tr>
        <td>${r.score}</td>
        <td><strong>${r.label}</strong> - ${r.desc}</td>
      </tr>
    `).join('');

    return `
      <div class="perf-form-shell appraisal-form">
        <div class="appraisal-form-header">
          <div>
            <p class="appraisal-form-title">APPRAISAL FORM ${selectedYear.split('-')[1] || ''}</p>
            <p class="appraisal-form-subtitle">Annual performance evaluation (1-year cycle)</p>
          </div>
        </div>

        <h4 class="perf-section-title">Employee Information</h4>
        ${employeeBlock}
        <div class="appraisal-info-grid">
          <div class="form-group">
            <label>Appraisal Year</label>
            <select id="appraisal-year" required>
              ${yearOptions.map(y => `<option value="${y}" ${selectedYear === y ? 'selected' : ''}>${y}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Designation</label>
            <input type="text" id="appraisal-designation" value="${ef.designation || ''}" required />
          </div>
          <div class="form-group">
            <label>Department</label>
            <input type="text" id="appraisal-department" value="${ef.department || ''}" required />
          </div>
          <div class="form-group">
            <label>Date of Joining</label>
            <input type="date" id="appraisal-join-date" value="${ef.dateOfJoining || ''}" required />
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" id="appraisal-location" value="${ef.location || 'Bangalore'}" required />
          </div>
          <div class="form-group">
            <label>Supervisor</label>
            <input type="text" id="appraisal-supervisor" value="${ef.supervisor || data.reviewer || ''}" required />
          </div>
        </div>
        <p class="form-hint perf-period-hint">Appraisal covers exactly <strong>1 year</strong>. For the current year, use <strong>${getCurrentAppraisalYearLabel()}</strong> (example: 2025-2026).</p>

        <h4 class="perf-section-title">Rating Scale</h4>
        <div class="appraisal-table-wrap">
          <table class="appraisal-scale-table">
            <thead>
              <tr>
                <th>Rating</th>
                <th>Performance Definition</th>
              </tr>
            </thead>
            <tbody>${ratingGuide}</tbody>
          </table>
        </div>

        <h4 class="perf-section-title">KRA / KPI Evaluation</h4>
        <div class="appraisal-table-wrap">
          <table class="appraisal-kpi-table">
            <thead>
              <tr>
                <th>KRA</th>
                <th>KPI / Description / Indicators with milestones / targets</th>
                <th>Rating</th>
                <th>Self - Remarks</th>
                <th>Self Rating (1-5)</th>
                <th>Evaluator 1 Remarks</th>
                <th>Evaluator 1 Rating (1-5)</th>
                <th>Evaluator 2 Remarks</th>
                <th>Evaluator 2 Rating (1-5)</th>
              </tr>
            </thead>
            <tbody>${kpiCards}</tbody>
            <tfoot>
              <tr class="appraisal-sum-row">
                <td colspan="4">Sum</td>
                <td id="appraisal-self-sum">0</td>
                <td></td>
                <td id="appraisal-ev1-sum">0</td>
                <td></td>
                <td id="appraisal-ev2-sum">0</td>
              </tr>
              <tr class="appraisal-score-row">
                <td colspan="4">Score</td>
                <td id="appraisal-self-score">0</td>
                <td></td>
                <td id="appraisal-ev1-score">0</td>
                <td></td>
                <td id="appraisal-ev2-score">0</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p class="appraisal-note">Please note that your evaluator 2 score can only give if evaluator 1 gives an evaluator 2 remarks. However, if evaluator 2 comments are not needed based on the role discretion of the Management or Board of Directors, evaluator 1 score may be treated as final.</p>

        <h4 class="perf-section-title">Objectives for Next Year</h4>
        <div class="form-group">
          <label>List down your objectives for next year. This will be used as part of your evaluation for next year.</label>
          <textarea id="appraisal-next-objectives" rows="3">${ef.nextYearObjectives || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Self-Development Goals</label>
          <textarea id="appraisal-self-dev-goals" rows="3">${ef.selfDevelopmentGoals || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Improvement Plans (training required, etc.)</label>
          <textarea id="appraisal-improvement-plans" rows="3">${ef.improvementPlans || ''}</textarea>
        </div>

        <h4 class="perf-section-title">Increment</h4>
        <div class="form-group">
          <label>Based on the statements above, do you feel you deserve an increment? YES OR NO:</label>
          <select id="appraisal-increment">
            <option value="" disabled ${!ef.incrementDeserved ? 'selected' : ''} hidden>Select</option>
            <option value="YES" ${ef.incrementDeserved === 'YES' ? 'selected' : ''}>YES</option>
            <option value="NO" ${ef.incrementDeserved === 'NO' ? 'selected' : ''}>NO</option>
          </select>
        </div>
        <div class="form-group">
          <label>If Yes, state the reasons in support of it</label>
          <textarea id="appraisal-increment-reasons" rows="3">${ef.incrementReasons || ''}</textarea>
        </div>

        <h4 class="perf-section-title">HR Equalization</h4>
        <div class="form-group">
          <label>HR Equalization (to be filled by the HR Department)</label>
          <textarea id="appraisal-hr-equalization" rows="3">${ef.hrEqualization || ''}</textarea>
        </div>
        <p class="appraisal-note">Increment are awarded based on the sole discretion of the Management or Board of Directors.</p>
      </div>`;
  }

  function bindAppraisalTotals() {
    const update = () => {
      let selfSum = 0; let ev1Sum = 0; let ev2Sum = 0;
      APPRAISAL_KPIS.forEach((_, i) => {
        selfSum += Number(document.getElementById(`appraisal-self-rating-${i}`)?.value || 0);
        ev1Sum += Number(document.getElementById(`appraisal-ev1-rating-${i}`)?.value || 0);
        ev2Sum += Number(document.getElementById(`appraisal-ev2-rating-${i}`)?.value || 0);
      });
      const selfEl = document.getElementById('appraisal-self-sum');
      const ev1El = document.getElementById('appraisal-ev1-sum');
      const ev2El = document.getElementById('appraisal-ev2-sum');
      const selfScoreEl = document.getElementById('appraisal-self-score');
      const ev1ScoreEl = document.getElementById('appraisal-ev1-score');
      const ev2ScoreEl = document.getElementById('appraisal-ev2-score');
      const rowCount = APPRAISAL_KPIS.length || 1;
      if (selfEl) selfEl.textContent = String(selfSum);
      if (ev1El) ev1El.textContent = String(ev1Sum);
      if (ev2El) ev2El.textContent = String(ev2Sum);
      if (selfScoreEl) selfScoreEl.textContent = (selfSum / rowCount).toFixed(1);
      if (ev1ScoreEl) ev1ScoreEl.textContent = (ev1Sum / rowCount).toFixed(1);
      if (ev2ScoreEl) ev2ScoreEl.textContent = (ev2Sum / rowCount).toFixed(1);
    };
    APPRAISAL_KPIS.forEach((_, i) => {
      [`appraisal-self-rating-${i}`, `appraisal-ev1-rating-${i}`, `appraisal-ev2-rating-${i}`].forEach(id => {
        document.getElementById(id)?.addEventListener('change', update);
      });
    });
    update();
  }

  function collectProbationForm() {
    const collectRows = (prefix, categories) => categories.map((category, index) => ({
      category,
      rating: document.querySelector(`input[name="${prefix}-rating-${index}"]:checked`)?.value || '',
      comments: document.getElementById(`${prefix}-comment-${index}`)?.value.trim() || ''
    }));
    return {
      jobTitle: document.getElementById('perf-job-title')?.value.trim() || '',
      reviewer: document.getElementById('perf-reviewer')?.value.trim() || '',
      reviewFrom: document.getElementById('perf-review-from')?.value || '',
      reviewTo: document.getElementById('perf-review-to')?.value || '',
      reviewStatus: document.getElementById('perf-status')?.value || '',
      reviewNotes: document.getElementById('perf-notes')?.value.trim() || '',
      goalsText: document.getElementById('perf-goals')?.value.trim() || '',
      coreValues: collectRows('core', PROBATION_CORE),
      jobCriteria: collectRows('job', PROBATION_JOB)
    };
  }

  function collectAppraisalForm() {
    const kpiRows = APPRAISAL_KPIS.map((item, index) => ({
      kra: item.kra,
      kpi: item.kpi,
      rating: document.getElementById(`appraisal-rating-${index}`)?.value || '',
      selfRemarks: document.getElementById(`appraisal-self-remarks-${index}`)?.value.trim() || '',
      selfRating: document.getElementById(`appraisal-self-rating-${index}`)?.value || '',
      evaluator1Rating: document.getElementById(`appraisal-ev1-rating-${index}`)?.value || '',
      evaluator1Remarks: document.getElementById(`appraisal-ev1-remarks-${index}`)?.value.trim() || '',
      evaluator2Rating: document.getElementById(`appraisal-ev2-rating-${index}`)?.value || '',
      evaluator2Remarks: document.getElementById(`appraisal-ev2-remarks-${index}`)?.value.trim() || ''
    }));

    const selfSum = kpiRows.reduce((s, r) => s + Number(r.selfRating || 0), 0);
    const ev1Sum = kpiRows.reduce((s, r) => s + Number(r.evaluator1Rating || 0), 0);
    const ev2Sum = kpiRows.reduce((s, r) => s + Number(r.evaluator2Rating || 0), 0);

    return {
      designation: document.getElementById('appraisal-designation')?.value.trim() || '',
      department: document.getElementById('appraisal-department')?.value.trim() || '',
      dateOfJoining: document.getElementById('appraisal-join-date')?.value || '',
      location: document.getElementById('appraisal-location')?.value.trim() || 'Bangalore',
      supervisor: document.getElementById('appraisal-supervisor')?.value.trim() || '',
      appraisalYear: document.getElementById('appraisal-year')?.value || '',
      kpiRows,
      totals: { selfSum, ev1Sum, ev2Sum },
      nextYearObjectives: document.getElementById('appraisal-next-objectives')?.value.trim() || '',
      selfDevelopmentGoals: document.getElementById('appraisal-self-dev-goals')?.value.trim() || '',
      improvementPlans: document.getElementById('appraisal-improvement-plans')?.value.trim() || '',
      incrementDeserved: document.getElementById('appraisal-increment')?.value || '',
      incrementReasons: document.getElementById('appraisal-increment-reasons')?.value.trim() || '',
      hrEqualization: document.getElementById('appraisal-hr-equalization')?.value.trim() || ''
    };
  }

  return {
    getReviewType,
    PROBATION_CORE,
    PROBATION_JOB,
    APPRAISAL_KPIS,
    employeeLookupHtml,
    bindEmployeeLookup,
    buildProbationFormHtml,
    buildAppraisalFormHtml,
    bindAppraisalTotals,
    collectProbationForm,
    collectAppraisalForm,
    lockFormReadOnly,
    validateProbationPeriod,
    validateAppraisalYear,
    getCurrentAppraisalYearLabel
  };
})();
