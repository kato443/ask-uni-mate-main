// Auto-reply knowledge base for UCU-BBUC Student Portal
// Each entry has one or more keyword patterns and a pre-written answer.
// The chat hook checks these BEFORE calling the AI API.

export interface AutoReply {
  keywords: string[];   // all must appear (lowercase) in the question
  answer: string;
}

export const autoReplies: AutoReply[] = [

  // ── Admissions & Applications ─────────────────────────────────────────────
  {
    keywords: ["admission", "requirement"],
    answer: `**Admission Requirements at UCU-BBUC**

To apply for undergraduate programmes you generally need:
- Uganda Certificate of Education (UCE) with at least 5 passes
- Uganda Advanced Certificate of Education (UACE) with at least 2 principal passes (for direct entry)
- Relevant professional qualifications may be considered for mature entry

Specific requirements vary by programme. Visit the Admissions Office or the UCU-BBUC website for the full list.`,
  },
  {
    keywords: ["apply", "trinity", "intake"],
    answer: `**Applying for Trinity Intake**

Trinity intake typically runs from January to April. To apply:
1. Collect an application form from the Admissions Office or download it from the website
2. Attach certified copies of your academic certificates
3. Attach two passport photos and a copy of your national ID
4. Pay the application fee at the Finance Office
5. Submit the completed form to the Admissions Office

Contact the Admissions Office for the exact Trinity intake dates each year.`,
  },
  {
    keywords: ["application", "deadline"],
    answer: `**Application Deadlines**

UCU-BBUC has three intakes per year:
- **August Intake** — applications typically close in July
- **January (Trinity) Intake** — applications typically close in December
- **May Intake** — applications typically close in April

Deadlines may shift slightly each year. Contact the Admissions Office to confirm current deadlines.`,
  },
  {
    keywords: ["document", "needed", "admission"],
    answer: `**Required Application Documents**

- Completed application form
- Certified copies of O-Level (UCE) results
- Certified copies of A-Level (UACE) results (or equivalent)
- Two recent passport-size photographs
- Copy of National ID or passport
- Application fee receipt
- Any additional certificates relevant to your chosen programme

All copies must be certified by the issuing institution or a recognised authority.`,
  },

  // ── Programs & Courses ────────────────────────────────────────────────────
  {
    keywords: ["program", "offer"],
    answer: `**Programmes Offered at UCU-BBUC**

UCU-BBUC offers programmes in:
- **Education** — Bachelor of Education (Arts & Science options)
- **Business** — Bachelor of Business Administration
- **Computing** — Bachelor of Science in Computer Science / Information Technology
- **Development Studies**
- **Theology & Religious Studies**
- **Health Sciences** (select programmes)

Postgraduate programmes are also available. Contact the Registrar or visit the website for the full, up-to-date list.`,
  },
  {
    keywords: ["undergraduate", "degree"],
    answer: `**Undergraduate Degrees at UCU-BBUC**

Available undergraduate degrees include:
- B.Ed (Arts) / B.Ed (Science)
- BBA (Business Administration)
- BSc Computer Science
- BSc Information Technology
- BA Development Studies
- BA Theology & Religious Studies

Each degree typically takes **3 to 4 years** of full-time study. Entry requirements vary by programme.`,
  },
  {
    keywords: ["postgraduate", "masters"],
    answer: `**Postgraduate Programmes at UCU-BBUC**

UCU-BBUC offers postgraduate study options including Masters degrees and postgraduate diplomas in selected fields. Entry typically requires a relevant Bachelor's degree with at least a Second Class (Lower) classification.

Contact the Registrar's Office for the current list of postgraduate programmes and intake dates.`,
  },
  {
    keywords: ["bachelor", "education", "duration"],
    answer: `**Bachelor of Education Duration**

The Bachelor of Education (B.Ed) at UCU-BBUC is a **4-year** programme for direct entry students. It prepares graduates to teach at secondary school level in Uganda.

The programme covers subject specialisations (Arts or Science), pedagogy, and professional teaching practice.`,
  },

  // ── Fees & Finance ────────────────────────────────────────────────────────
  {
    keywords: ["tuition", "fee"],
    answer: `**Tuition Fees**

Tuition fees at UCU-BBUC vary by programme and year of study. As a general guide:
- Fees are paid per semester
- Current fee schedules are issued at the start of each academic year

Please visit the **Finance Office** or contact them at finance@bbuc.ac.ug for the exact fee structure for your programme and intake.`,
  },
  {
    keywords: ["accommodation", "fee"],
    answer: `**Accommodation Fees**

On-campus accommodation fees are charged per semester and vary by room type (single, double, dormitory). Fees are payable at the Finance Office along with tuition.

Contact the Student Affairs Office for current accommodation fee rates and availability.`,
  },
  {
    keywords: ["scholarship"],
    answer: `**Scholarships at UCU-BBUC**

Scholarships available to students include:
- **Government Sponsorship** — through the Uganda Government bursary scheme (MOES)
- **UCU Scholarships** — merit-based and need-based awards managed by UCU main campus
- **Church/Mission Scholarships** — through various church bodies affiliated with UCU
- **External Scholarships** — organisations such as MasterCard Foundation

Contact the Admissions or Student Affairs Office for guidance on how to apply.`,
  },
  {
    keywords: ["payment", "method", "fee"],
    answer: `**Fee Payment Methods**

You can pay fees at UCU-BBUC through:
- **Bank transfer** to the UCU-BBUC designated bank account
- **Mobile Money** (MTN or Airtel) — use the provided paybill/merchant number
- **Cash payment** at the Finance Office

Always keep your payment receipt and present it when registering for the semester.`,
  },

  // ── Campus & Facilities ───────────────────────────────────────────────────
  {
    keywords: ["ict", "lab"],
    answer: `**ICT Lab**

The ICT lab at UCU-BBUC is located in the **main academic block**. It is equipped with desktop computers, internet access, and printing facilities.

Lab hours are typically **Monday to Friday, 8 AM – 6 PM**, and may be extended during exam periods. Students are required to present their student ID to access the lab.`,
  },
  {
    keywords: ["library"],
    answer: `**Library**

UCU-BBUC has a well-stocked library offering:
- Academic textbooks and reference materials
- Journals and periodicals
- Computer terminals with internet access
- Quiet reading and study spaces

Library hours: **Monday – Friday, 8 AM – 9 PM** | **Saturday, 9 AM – 5 PM**. Students need their valid student ID to borrow books.`,
  },
  {
    keywords: ["accommodation", "campus", "hostel"],
    answer: `**Student Accommodation**

UCU-BBUC has on-campus student hostels for both male and female students. Accommodation is allocated on a first-come, first-served basis each semester.

To apply for accommodation:
1. Submit an accommodation request form to the Student Affairs Office
2. Pay the accommodation fee at the Finance Office
3. Collect your room allocation letter

Contact Student Affairs for availability and room types.`,
  },
  {
    keywords: ["sport", "facilitie"],
    answer: `**Sports Facilities**

UCU-BBUC offers the following sports facilities:
- **Football pitch**
- **Volleyball and netball courts**
- **Basketball court**
- **Athletics track** (shared)

The university also has active student sports clubs. Contact the Student Affairs Office to join a team or find out about upcoming sports events.`,
  },

  // ── Academic Life ─────────────────────────────────────────────────────────
  {
    keywords: ["academic", "year", "start"],
    answer: `**Academic Year**

The UCU-BBUC academic year is divided into **three semesters**:
- **Semester I** — August to December
- **Semester II (Trinity)** — January to April
- **Semester III** — May to July

Exact dates are published in the Academic Calendar available from the Registrar's Office at the start of each year.`,
  },
  {
    keywords: ["exam", "conducted"],
    answer: `**Examinations**

End-of-semester examinations at UCU-BBUC are:
- **Written exams** held in designated exam halls
- Continuous Assessment Tests (CATs) conducted during the semester contribute to your final grade
- A student must attend at least **75% of lectures** to be eligible to sit exams
- Examination timetables are released 2–3 weeks before the exam period

Contact the Registrar's Office for information on special sittings or retakes.`,
  },
  {
    keywords: ["grading", "system"],
    answer: `**Grading System**

UCU-BBUC uses the following grading scale:

| Grade | Marks | Points |
|-------|-------|--------|
| A | 80 – 100% | 5.0 |
| B+ | 75 – 79% | 4.5 |
| B | 70 – 74% | 4.0 |
| C+ | 65 – 69% | 3.5 |
| C | 60 – 64% | 3.0 |
| D | 50 – 59% | 2.0 |
| F | Below 50% | 0.0 |

Your CGPA is calculated from these grade points weighted by credit units.`,
  },
  {
    keywords: ["transcript"],
    answer: `**Academic Transcripts**

To request an official academic transcript:
1. Visit the **Registrar's Office**
2. Fill in a transcript request form
3. Pay the transcript fee at the Finance Office
4. Collect your transcript (processing takes 3–5 working days)

Urgent requests may be available at an additional fee. Contact the Registrar's Office for details.`,
  },

  // ── CGPA ──────────────────────────────────────────────────────────────────
  {
    keywords: ["cgpa", "calculated"],
    answer: `**How CGPA is Calculated**

CGPA (Cumulative Grade Point Average) is calculated as:

**CGPA = Σ(Grade Points × Credit Units) ÷ Σ(Credit Units)**

For each course:
1. Convert your percentage mark to grade points using the grading scale
2. Multiply grade points by the credit units for that course
3. Add all these products together
4. Divide by the total credit units attempted

Your CGPA is recalculated at the end of each semester and shown on your results slip.`,
  },
  {
    keywords: ["minimum", "cgpa", "pass"],
    answer: `**Minimum CGPA to Pass**

At UCU-BBUC, you must maintain a **minimum CGPA of 2.0** (equivalent to a D grade average) to remain in good academic standing.

Falling below 2.0 may result in:
- Academic warning
- Probationary status
- Discontinuation if not improved within the specified period

Contact your Head of Department or the Dean of Students for academic counselling support.`,
  },
  {
    keywords: ["cgpa", "first class"],
    answer: `**CGPA Requirements for Degree Classifications**

| Classification | CGPA Required |
|---|---|
| First Class | 4.40 – 5.00 |
| Second Class (Upper) | 3.60 – 4.39 |
| Second Class (Lower) | 2.80 – 3.59 |
| Pass | 2.00 – 2.79 |
| Fail | Below 2.00 |

*(Figures are approximate — confirm with the Registrar's Office)*`,
  },

  // ── Core Units ────────────────────────────────────────────────────────────
  {
    keywords: ["core", "unit", "compulsory"],
    answer: `**Core Units**

Core units are **compulsory courses** that every student in a programme must take and pass regardless of their specialisation. They form the academic backbone of your degree.

Examples of common core units include:
- Communication Skills
- Introduction to Computing
- Entrepreneurship & Business Skills
- Christian Ethics (for some programmes)

Core units are listed in your programme's course structure available from the Registrar's Office.`,
  },
  {
    keywords: ["credit", "unit", "graduate"],
    answer: `**Credit Units Required to Graduate**

The number of credit units required to graduate depends on your programme:
- **3-year degrees** — approximately **90–105 credit units**
- **4-year degrees** — approximately **120–135 credit units**

Each course is typically worth **3 credit units**. Full-time students normally take **15–18 credit units per semester**. Your exact requirements are in your programme's curriculum document.`,
  },
  {
    keywords: ["fail", "core", "unit"],
    answer: `**What Happens if You Fail a Core Unit?**

If you fail a core unit:
1. You **must** retake it — you cannot graduate without passing all core units
2. You may retake in the next available semester when the unit is offered
3. The retake mark replaces the original fail in your results, but some institutions note both attempts on the transcript
4. Repeated failure of a core unit may lead to academic probation or discontinuation

Seek help from your lecturer or academic advisor early if you are struggling with a core unit.`,
  },

  // ── Contact & Support ─────────────────────────────────────────────────────
  {
    keywords: ["contact", "admission"],
    answer: `**Admissions Office Contact**

- 📍 **Location:** Main Administration Block, UCU-BBUC Campus, Kabale
- 📞 **Phone:** +256 (0)486 422XXX *(confirm current number at the front desk)*
- 📧 **Email:** admissions@bbuc.ac.ug
- 🕒 **Office Hours:** Monday – Friday, 8 AM – 5 PM

You can also visit in person — the Admissions Office is on the ground floor of the Administration Building.`,
  },
  {
    keywords: ["located", "where", "bbuc"],
    answer: `**UCU-BBUC Location**

Bishop Barham University College (UCU-BBUC) is located in:

📍 **Kabale, Uganda**
Plot 64, Rugarama Hill
P.O. Box 726, Kabale

It is approximately **430 km from Kampala** (about 7–8 hours by road). Kabale is accessible by bus (Gateway, Link, or Gaagaa coaches) from Kampala's Kisenyi Bus Terminal.`,
  },
  {
    keywords: ["opening", "hour", "campus"],
    answer: `**Campus Opening Hours**

- **Main Gate:** Open 24 hours (controlled access at night)
- **Administration Offices:** Monday – Friday, 8 AM – 5 PM
- **Library:** Monday – Friday, 8 AM – 9 PM | Saturday, 9 AM – 5 PM
- **ICT Lab:** Monday – Friday, 8 AM – 6 PM
- **Health Centre:** Monday – Friday, 8 AM – 8 PM

Hours may vary during public holidays and exam periods.`,
  },
  {
    keywords: ["student", "support", "service"],
    answer: `**Student Support Services**

UCU-BBUC provides the following student support services:
- 🎓 **Academic Counselling** — Head of Department or Dean of Students
- 💬 **Pastoral / Spiritual Care** — University Chaplain
- 🏥 **Health Centre** — on-campus medical services
- 💼 **Career & Placement Services** — Student Affairs Office
- 📚 **Peer Tutoring** — arranged through the Faculty offices

Visit the **Student Affairs Office** (Administration Block) or email studentaffairs@bbuc.ac.ug.`,
  },
];

/**
 * Returns a pre-written answer if the question matches any auto-reply entry.
 * Matching is keyword-based (all keywords must appear in the question).
 */
export function findAutoReply(question: string): string | null {
  const q = question.toLowerCase();
  for (const entry of autoReplies) {
    if (entry.keywords.every((kw) => q.includes(kw))) {
      return entry.answer;
    }
  }
  return null;
}
