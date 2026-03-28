-- Migration: Create auto_replies table for Knowledge Base
-- Date: 2026-03-28

CREATE TABLE IF NOT EXISTS auto_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keywords TEXT[] NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Turn on Row Level Security
ALTER TABLE auto_replies ENABLE ROW LEVEL SECURITY;

-- Allow public read access to auto_replies (so the chat hook can read them)
CREATE POLICY "Allow public read access to auto_replies" ON auto_replies
  FOR SELECT USING (true);

-- Allow admins full access to auto_replies
CREATE POLICY "Allow admin full access to auto_replies" ON auto_replies
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Function to automatically update 'updated_at'
CREATE OR REPLACE FUNCTION update_auto_replies_mod_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_auto_replies_trigger
  BEFORE UPDATE ON auto_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_auto_replies_mod_time();

-- Insert existing base data from autoReplies.ts
INSERT INTO auto_replies (keywords, answer) VALUES 
(ARRAY['admission', 'requirement'], '**Admission Requirements at UCU-BBUC**

To apply for undergraduate programmes you generally need:
- Uganda Certificate of Education (UCE) with at least 5 passes
- Uganda Advanced Certificate of Education (UACE) with at least 2 principal passes (for direct entry)
- Relevant professional qualifications may be considered for mature entry

Specific requirements vary by programme. Visit the Admissions Office or the UCU-BBUC website for the full list.'),

(ARRAY['apply', 'trinity', 'intake'], '**Applying for Trinity Intake**

Trinity intake typically runs from January to April. To apply:
1. Collect an application form from the Admissions Office or download it from the website
2. Attach certified copies of your academic certificates
3. Attach two passport photos and a copy of your national ID
4. Pay the application fee at the Finance Office
5. Submit the completed form to the Admissions Office

Contact the Admissions Office for the exact Trinity intake dates each year.'),

(ARRAY['application', 'deadline'], '**Application Deadlines**

UCU-BBUC has three intakes per year:
- **August Intake** — applications typically close in July
- **January (Trinity) Intake** — applications typically close in December
- **May Intake** — applications typically close in April

Deadlines may shift slightly each year. Contact the Admissions Office to confirm current deadlines.'),

(ARRAY['document', 'needed', 'admission'], '**Required Application Documents**

- Completed application form
- Certified copies of O-Level (UCE) results
- Certified copies of A-Level (UACE) results (or equivalent)
- Two recent passport-size photographs
- Copy of National ID or passport
- Application fee receipt
- Any additional certificates relevant to your chosen programme

All copies must be certified by the issuing institution or a recognised authority.'),

(ARRAY['program', 'offer'], '**Programmes Offered at UCU-BBUC**

UCU-BBUC offers programmes in:
- **Education** — Bachelor of Education (Arts & Science options)
- **Business** — Bachelor of Business Administration
- **Computing** — Bachelor of Science in Computer Science / Information Technology
- **Development Studies**
- **Theology & Religious Studies**
- **Health Sciences** (select programmes)

Postgraduate programmes are also available. Contact the Registrar or visit the website for the full, up-to-date list.'),

(ARRAY['undergraduate', 'degree'], '**Undergraduate Degrees at UCU-BBUC**

Available undergraduate degrees include:
- B.Ed (Arts) / B.Ed (Science)
- BBA (Business Administration)
- BSc Computer Science
- BSc Information Technology
- BA Development Studies
- BA Theology & Religious Studies

Each degree typically takes **3 to 4 years** of full-time study. Entry requirements vary by programme.'),

(ARRAY['postgraduate', 'masters'], '**Postgraduate Programmes at UCU-BBUC**

UCU-BBUC offers postgraduate study options including Masters degrees and postgraduate diplomas in selected fields. Entry typically requires a relevant Bachelor''s degree with at least a Second Class (Lower) classification.

Contact the Registrar''s Office for the current list of postgraduate programmes and intake dates.'),

(ARRAY['bachelor', 'education', 'duration'], '**Bachelor of Education Duration**

The Bachelor of Education (B.Ed) at UCU-BBUC is a **4-year** programme for direct entry students. It prepares graduates to teach at secondary school level in Uganda.

The programme covers subject specialisations (Arts or Science), pedagogy, and professional teaching practice.'),

(ARRAY['tuition', 'fee'], '**Tuition Fees**

Tuition fees at UCU-BBUC vary by programme and year of study. As a general guide:
- Fees are paid per semester
- Current fee schedules are issued at the start of each academic year

Please visit the **Finance Office** or contact them at finance@bbuc.ac.ug for the exact fee structure for your programme and intake.'),

(ARRAY['accommodation', 'fee'], '**Accommodation Fees**

On-campus accommodation fees are charged per semester and vary by room type (single, double, dormitory). Fees are payable at the Finance Office along with tuition.

Contact the Student Affairs Office for current accommodation fee rates and availability.'),

(ARRAY['scholarship'], '**Scholarships at UCU-BBUC**

Scholarships available to students include:
- **Government Sponsorship** — through the Uganda Government bursary scheme (MOES)
- **UCU Scholarships** — merit-based and need-based awards managed by UCU main campus
- **Church/Mission Scholarships** — through various church bodies affiliated with UCU
- **External Scholarships** — organisations such as MasterCard Foundation

Contact the Admissions or Student Affairs Office for guidance on how to apply.'),

(ARRAY['payment', 'method', 'fee'], '**Fee Payment Methods**

You can pay fees at UCU-BBUC through:
- **Bank transfer** to the UCU-BBUC designated bank account
- **Mobile Money** (MTN or Airtel) — use the provided paybill/merchant number
- **Cash payment** at the Finance Office

Always keep your payment receipt and present it when registering for the semester.'),

(ARRAY['ict', 'lab'], '**ICT Lab**

The ICT lab at UCU-BBUC is located in the **main academic block**. It is equipped with desktop computers, internet access, and printing facilities.

Lab hours are typically **Monday to Friday, 8 AM – 6 PM**, and may be extended during exam periods. Students are required to present their student ID to access the lab.'),

(ARRAY['library'], '**Library**

UCU-BBUC has a well-stocked library offering:
- Academic textbooks and reference materials
- Journals and periodicals
- Computer terminals with internet access
- Quiet reading and study spaces

Library hours: **Monday – Friday, 8 AM – 9 PM** | **Saturday, 9 AM – 5 PM**. Students need their valid student ID to borrow books.'),

(ARRAY['accommodation', 'campus', 'hostel'], '**Student Accommodation**

UCU-BBUC has on-campus student hostels for both male and female students. Accommodation is allocated on a first-come, first-served basis each semester.

To apply for accommodation:
1. Submit an accommodation request form to the Student Affairs Office
2. Pay the accommodation fee at the Finance Office
3. Collect your room allocation letter

Contact Student Affairs for availability and room types.'),

(ARRAY['sport', 'facilitie'], '**Sports Facilities**

UCU-BBUC offers the following sports facilities:
- **Football pitch**
- **Volleyball and netball courts**
- **Basketball court**
- **Athletics track** (shared)

The university also has active student sports clubs. Contact the Student Affairs Office to join a team or find out about upcoming sports events.'),

(ARRAY['academic', 'year', 'start'], '**Academic Year**

The UCU-BBUC academic year is divided into **three semesters**:
- **Semester I** — August to December
- **Semester II (Trinity)** — January to April
- **Semester III** — May to July

Exact dates are published in the Academic Calendar available from the Registrar''s Office at the start of each year.'),

(ARRAY['exam', 'conducted'], '**Examinations**

End-of-semester examinations at UCU-BBUC are:
- **Written exams** held in designated exam halls
- Continuous Assessment Tests (CATs) conducted during the semester contribute to your final grade
- A student must attend at least **75% of lectures** to be eligible to sit exams
- Examination timetables are released 2–3 weeks before the exam period

Contact the Registrar''s Office for information on special sittings or retakes.'),

(ARRAY['grading', 'system'], '**Grading System**

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

Your CGPA is calculated from these grade points weighted by credit units.'),

(ARRAY['transcript'], '**Academic Transcripts**

To request an official academic transcript:
1. Visit the **Registrar''s Office**
2. Fill in a transcript request form
3. Pay the transcript fee at the Finance Office
4. Collect your transcript (processing takes 3–5 working days)

Urgent requests may be available at an additional fee. Contact the Registrar''s Office for details.'),

(ARRAY['cgpa', 'calculated'], '**How CGPA is Calculated**

CGPA (Cumulative Grade Point Average) is calculated as:

**CGPA = Σ(Grade Points × Credit Units) ÷ Σ(Credit Units)**

For each course:
1. Convert your percentage mark to grade points using the grading scale
2. Multiply grade points by the credit units for that course
3. Add all these products together
4. Divide by the total credit units attempted

Your CGPA is recalculated at the end of each semester and shown on your results slip.'),

(ARRAY['minimum', 'cgpa', 'pass'], '**Minimum CGPA to Pass**

At UCU-BBUC, you must maintain a **minimum CGPA of 2.0** (equivalent to a D grade average) to remain in good academic standing.

Falling below 2.0 may result in:
- Academic warning
- Probationary status
- Discontinuation if not improved within the specified period

Contact your Head of Department or the Dean of Students for academic counselling support.'),

(ARRAY['cgpa', 'first class'], '**CGPA Requirements for Degree Classifications**

| Classification | CGPA Required |
|---|---|
| First Class | 4.40 – 5.00 |
| Second Class (Upper) | 3.60 – 4.39 |
| Second Class (Lower) | 2.80 – 3.59 |
| Pass | 2.00 – 2.79 |
| Fail | Below 2.00 |

*(Figures are approximate — confirm with the Registrar''s Office)*'),

(ARRAY['core', 'unit', 'compulsory'], '**Core Units**

Core units are **compulsory courses** that every student in a programme must take and pass regardless of their specialisation. They form the academic backbone of your degree.

Examples of common core units include:
- Communication Skills
- Introduction to Computing
- Entrepreneurship & Business Skills
- Christian Ethics (for some programmes)

Core units are listed in your programme''s course structure available from the Registrar''s Office.'),

(ARRAY['credit', 'unit', 'graduate'], '**Credit Units Required to Graduate**

The number of credit units required to graduate depends on your programme:
- **3-year degrees** — approximately **90–105 credit units**
- **4-year degrees** — approximately **120–135 credit units**

Each course is typically worth **3 credit units**. Full-time students normally take **15–18 credit units per semester**. Your exact requirements are in your programme''s curriculum document.'),

(ARRAY['fail', 'core', 'unit'], '**What Happens if You Fail a Core Unit?**

If you fail a core unit:
1. You **must** retake it — you cannot graduate without passing all core units
2. You may retake in the next available semester when the unit is offered
3. The retake mark replaces the original fail in your results, but some institutions note both attempts on the transcript
4. Repeated failure of a core unit may lead to academic probation or discontinuation

Seek help from your lecturer or academic advisor early if you are struggling with a core unit.'),

(ARRAY['contact', 'admission'], '**Admissions Office Contact**

- 📍 **Location:** Main Administration Block, UCU-BBUC Campus, Kabale
- 📞 **Phone:** +256 (0)486 422XXX *(confirm current number at the front desk)*
- 📧 **Email:** admissions@bbuc.ac.ug
- 🕒 **Office Hours:** Monday – Friday, 8 AM – 5 PM

You can also visit in person — the Admissions Office is on the ground floor of the Administration Building.'),

(ARRAY['located', 'where', 'bbuc'], '**UCU-BBUC Location**

Bishop Barham University College (UCU-BBUC) is located in:

📍 **Kabale, Uganda**
Plot 64, Rugarama Hill
P.O. Box 726, Kabale

It is approximately **430 km from Kampala** (about 7–8 hours by road). Kabale is accessible by bus (Gateway, Link, or Gaagaa coaches) from Kampala''s Kisenyi Bus Terminal.'),

(ARRAY['opening', 'hour', 'campus'], '**Campus Opening Hours**

- **Main Gate:** Open 24 hours (controlled access at night)
- **Administration Offices:** Monday – Friday, 8 AM – 5 PM
- **Library:** Monday – Friday, 8 AM – 9 PM | Saturday, 9 AM – 5 PM
- **ICT Lab:** Monday – Friday, 8 AM – 6 PM
- **Health Centre:** Monday – Friday, 8 AM – 8 PM

Hours may vary during public holidays and exam periods.'),

(ARRAY['student', 'support', 'service'], '**Student Support Services**

UCU-BBUC provides the following student support services:
- 🎓 **Academic Counselling** — Head of Department or Dean of Students
- 💬 **Pastoral / Spiritual Care** — University Chaplain
- 🏥 **Health Centre** — on-campus medical services
- 💼 **Career & Placement Services** — Student Affairs Office
- 📚 **Peer Tutoring** — arranged through the Faculty offices

Visit the **Student Affairs Office** (Administration Block) or email studentaffairs@bbuc.ac.ug.');
