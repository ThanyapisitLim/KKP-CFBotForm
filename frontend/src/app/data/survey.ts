// Bilingual content & schema for the CF BOT feedback survey
// Source: "แบบสอบถามความคิดเห็นและความต้องการใช้งาน Line Official: CF BOT"

export type Lang = "th" | "en";

export interface Bilingual {
  th: string;
  en: string;
}

export interface Option {
  id: string;
  label: Bilingual;
  /** Renders a free-text input that appears when this option is selected ("อื่น ๆ ระบุ") */
  isOther?: boolean;
  /** Renders an inline free-text input attached to this option (e.g. "ระบุ ____") */
  hasSpec?: boolean;
}

export type QuestionType =
  | "text"
  | "radio"
  | "checkbox"
  | "checkboxLimit"
  | "matrix"
  | "ranking"
  | "textarea"
  | "select";

export interface Question {
  id: string;
  type: QuestionType;
  number: number;
  title: Bilingual;
  description?: Bilingual;
  options?: Option[];
  rows?: { id: string; label: Bilingual }[];
  rankLabels?: Bilingual[];
  limit?: number;
  placeholder?: Bilingual;
  /** If true, this question can be left blank (default: required) */
  optional?: boolean;
  followUp?: {
    id: string;
    title: Bilingual;
    placeholder?: Bilingual;
    /** If true, the follow-up field can be left blank (default: required) */
    optional?: boolean;
  };
}

export interface Section {
  id: string;
  title: Bilingual;
  description?: Bilingual;
  questions: Question[];
}

export const SCALE_LABELS = {
  min: { th: "น้อยที่สุด", en: "Lowest" },
  max: { th: "มากที่สุด", en: "Highest" },
};

export const SURVEY_TITLE: Bilingual = {
  th: "แบบสอบถามความคิดเห็นและความต้องการใช้งาน",
  en: "Feedback & Usage Survey",
};

export const SURVEY_SUBTITLE: Bilingual = {
  th: "Line Official : CF BOT",
  en: "Line Official : CF BOT",
};

export const SURVEY_PURPOSE: Bilingual = {
  th: "วัตถุประสงค์: เพื่อสำรวจพฤติกรรมการใช้งาน ความพึงพอใจ ปัญหาและความต้องการเพิ่มเติม เพื่อนำไปพัฒนา CF BOT ให้ช่วยสนับสนุนการทำงานและการขายได้ดียิ่งขึ้น",
  en: "Purpose: To explore usage behavior, satisfaction, issues, and additional needs in order to improve CF BOT and better support sales and daily work.",
};

export const SURVEY_NOTE: Bilingual = {
  th: "คำชี้แจง: กรุณาเลือกคำตอบที่ตรงกับความคิดเห็นของท่านมากที่สุด โดยข้อมูลจะถูกใช้เพื่อการวิเคราะห์และปรับปรุงระบบเท่านั้น",
  en: "Note: Please select the answer that best reflects your opinion. Your responses will be used only for analysis and system improvement.",
};

export const THANK_YOU: Bilingual = {
  th: "ขอบคุณสำหรับความคิดเห็นของท่าน — ข้อมูลนี้จะช่วยให้ทีมพัฒนา CF BOT ให้ตอบโจทย์การใช้งานจริงมากยิ่งขึ้น",
  en: "Thank you for your feedback — your input will help our team develop CF BOT to better fit real-world usage.",
};

export const OTHER_PLACEHOLDER: Bilingual = {
  th: "โปรดระบุ",
  en: "Please specify",
};

export const SECTIONS: Section[] = [
  {
    id: "respondent",
    title: { th: "ส่วนที่ 1: ข้อมูลผู้ตอบ", en: "Part 1: Respondent Information" },
    questions: [
      {
        id: "q1_team",
        type: "select", // <-- 2. เปลี่ยนประเภทจาก "text" เป็น "select"
        number: 1,
        title: { th: "ทีม / หน่วยงาน", en: "Team / Department" },
        options: [
          {
            id: "sb_acquiring_1",
            label: { th: "Small Business Acquiring 1", en: "Small Business Acquiring 1" },
          },
          {
            id: "sb_acquiring_1_t1",
            label: { th: "Small Business Acquiring 1 ทีม 1", en: "Small Business Acquiring 1 Team 1" },
          },
          {
            id: "sb_acquiring_1_t2",
            label: { th: "Small Business Acquiring 1 ทีม 2", en: "Small Business Acquiring 1 Team 2" },
          },
          {
            id: "sb_acquiring_1_t3",
            label: { th: "Small Business Acquiring 1 ทีม 3", en: "Small Business Acquiring 1 Team 3" },
          },
          {
            id: "sb_acquiring_1_t4",
            label: { th: "Small Business Acquiring 1 ทีม 4", en: "Small Business Acquiring 1 Team 4" },
          },
          {
            id: "sb_acquiring_2",
            label: { th: "Small Business Acquiring 2", en: "Small Business Acquiring 2" },
          },
          {
            id: "sb_acquiring_2_t1",
            label: { th: "Small Business Acquiring 2 ทีม 1", en: "Small Business Acquiring 2 Team 1" },
          },
          {
            id: "sb_acquiring_2_t2",
            label: { th: "Small Business Acquiring 2 ทีม 2", en: "Small Business Acquiring 2 Team 2" },
          },
          {
            id: "personal_acquiring_1",
            label: { th: "Personal Acquiring 1", en: "Personal Acquiring 1" },
          },
          {
            id: "personal_acquiring_1_t1",
            label: { th: "Personal Acquiring 1 Team 1", en: "Personal Acquiring 1 Team 1" },
          },
          {
            id: "personal_acquiring_1_t2",
            label: { th: "Personal Acquiring 1 Team 2", en: "Personal Acquiring 1 Team 2" },
          },
          {
            id: "personal_acquiring_1_t3",
            label: { th: "Personal Acquiring 1 Team 3", en: "Personal Acquiring 1 Team 3" },
          },
          {
            id: "personal_acquiring_3",
            label: { th: "Personal Acquiring 3", en: "Personal Acquiring 3" },
          },
          {
            id: "personal_acquiring_3_t1",
            label: { th: "Personal Acquiring 3 Team 1", en: "Personal Acquiring 3 Team 1" },
          },
          {
            id: "personal_acquiring_3_t2",
            label: { th: "Personal Acquiring 3 Team 2", en: "Personal Acquiring 3 Team 2" },
          },
          {
            id: "corporate_employee_banking",
            label: { th: "Corporate Employee Banking", en: "Corporate Employee Banking" },
          },
          {
            id: "home_loan_acquiring_1",
            label: { th: "Home Loan Acquiring 1", en: "Home Loan Acquiring 1" },
          },
          {
            id: "home_loan_acquiring_2",
            label: { th: "Home Loan Acquiring 2", en: "Home Loan Acquiring 2" },
          },
          {
            id: "home_loan_acquiring_3",
            label: { th: "Home Loan Acquiring 3", en: "Home Loan Acquiring 3" },
          },
          {
            id: "personal_acquiring_2",
            label: { th: "Personal Acquiring 2", en: "Personal Acquiring 2" },
          },
          {
            id: "cross_sell_lending",
            label: { th: "Cross Sell Lending", en: "Cross Sell Lending" },
          },
          {
            id: "cross_sell_non_life_insurance",
            label: { th: "Cross Sell Non-Life Insurance", en: "Cross Sell Non-Life Insurance" },
          },
          {
            id: "back_office",
            label: { th: "Back office", en: "Back office" },
          },
          {
            id: "other",
            label: { th: "อื่น ๆ (ระบุชื่อทีม/หน่วยงาน)", en: "Other (please specify)" },
            isOther: true,
          },
        ],
      },
      {
        id: "q2_role",
        type: "radio",
        number: 2,
        title: { th: "บทบาท", en: "Role" },
        options: [
          { id: "sales_agent", label: { th: "Sales Agent", en: "Sales Agent" } },
          { id: "group_leader", label: { th: "Group Leader", en: "Group Leader" } },
          { id: "team_manager", label: { th: "Team Manager", en: "Team Manager" } },
          { id: "sale_head", label: { th: "Sale Head", en: "Sale Head" } },
          { id: "other", label: { th: "อื่น ๆ", en: "Other" }, isOther: true },
        ],
      },
      {
        id: "q3_tenure",
        type: "radio",
        number: 3,
        title: { th: "อายุงาน", en: "Years of Service" },
        options: [
          { id: "lt_6m", label: { th: "น้อยกว่า 6 เดือน", en: "Less than 6 months" } },
          { id: "6m_1y", label: { th: "6 เดือน–1 ปี", en: "6 months – 1 year" } },
          { id: "1y_3y", label: { th: "1–3 ปี", en: "1–3 years" } },
          { id: "gt_3y", label: { th: "มากกว่า 3 ปี", en: "More than 3 years" } },
        ],
      },
      {
        id: "q4_device",
        type: "radio",
        number: 4,
        title: { th: "อุปกรณ์ที่ใช้ CF BOT เป็นหลัก", en: "Primary device used for CF BOT" },
        options: [
          { id: "mobile", label: { th: "มือถือ", en: "Mobile phone" } },
          { id: "tablet", label: { th: "แท็บเล็ต", en: "Tablet" } },
          { id: "other", label: { th: "อื่น ๆ", en: "Other" }, isOther: true },
        ],
      },
    ],
  },
  {
    id: "usage",
    title: { th: "ส่วนที่ 2: พฤติกรรมการใช้งาน CF BOT", en: "Part 2: CF BOT Usage Behavior" },
    questions: [
      {
        id: "q5_frequency",
        type: "radio",
        number: 5,
        title: { th: "ท่านใช้งาน Line Official : CF BOT บ่อยเพียงใด", en: "How often do you use Line Official: CF BOT?" },
        options: [
          { id: "never", label: { th: "ไม่เคยใช้งาน", en: "Never used" } },
          { id: "lt_1_week", label: { th: "น้อยกว่า 1 ครั้ง/สัปดาห์", en: "Less than 1 time/week" } },
          { id: "1_2_week", label: { th: "1–2 ครั้ง/สัปดาห์", en: "1–2 times/week" } },
          { id: "3_4_week", label: { th: "3–4 ครั้ง/สัปดาห์", en: "3–4 times/week" } },
          { id: "5_7_week", label: { th: "5–7 ครั้ง/สัปดาห์", en: "5–7 times/week" } },
          { id: "gt_7_week", label: { th: "มากกว่า 7 ครั้ง/สัปดาห์", en: "More than 7 times/week" } },
          { id: "every_broadcast", label: { th: "ใช้ทุกครั้งที่มี Broadcast / ประกาศ", en: "Every time there's a broadcast/announcement" } },
        ],
      },
      {
        id: "q6_purpose",
        type: "checkbox",
        number: 6,
        title: { th: "วัตถุประสงค์หลักที่ท่านเข้าใช้งาน CF BOT คืออะไร", en: "What are your main purposes for using CF BOT?" },
        description: { th: "(เลือกได้มากกว่า 1 ข้อ)", en: "(Select all that apply)" },
        options: [
          { id: "product_info", label: { th: "ค้นหาข้อมูลผลิตภัณฑ์", en: "Search for product information" } },
          { id: "compliance", label: { th: "ตรวจสอบข้อมูล Compliance / PDPA / Governance", en: "Check Compliance / PDPA / Governance information" } },
          { id: "calculator", label: { th: "ใช้เครื่องมือคำนวณ", en: "Use calculation tools" } },
          { id: "performance", label: { th: "ดูผลงาน Sales Performance / Commission", en: "View Sales Performance / Commission" } },
          { id: "welfare_list", label: { th: "ค้นหารายชื่อบริษัท Welfare List", en: "Search Welfare List companies" } },
          { id: "broadcast", label: { th: "ดูประกาศหรือ Broadcast", en: "View announcements / broadcasts" } },
          { id: "content", label: { th: "เรียนรู้ Content / VDO / Infographic", en: "Learn from content / videos / infographics" } },
          { id: "bot_assistant", label: { th: "ฝึกบทสนทนาขายผ่าน Bot Assistant", en: "Practice sales conversations via Bot Assistant" } },
          { id: "other", label: { th: "อื่น ๆ ระบุ", en: "Other (please specify)" }, isOther: true },
        ],
      },
      {
        id: "q7_most_used_menu",
        type: "radio",
        number: 7,
        title: { th: "เมนูใดที่ท่านใช้งานบ่อยที่สุด", en: "Which menu do you use most often?" },
        description: { th: "(เลือก 1 ข้อ)", en: "(Select 1)" },
        options: [
          { id: "messenger_online", label: { th: "Messenger Online", en: "Messenger Online" } },
          { id: "compliance_pdpa", label: { th: "Compliance & PDPA", en: "Compliance & PDPA" } },
          { id: "product_detail", label: { th: "รายละเอียดผลิตภัณฑ์", en: "Product details" }, hasSpec: true },
          { id: "installment_calc", label: { th: "เครื่องมือคำนวณค่างวด", en: "Installment calculator" }, hasSpec: true },
          { id: "performance", label: { th: "Sales Performance / Commission", en: "Sales Performance / Commission" } },
          { id: "welfare_list", label: { th: "ค้นหารายชื่อบริษัท Welfare List", en: "Search Welfare List companies" } },
          { id: "bot_assistant", label: { th: "Bot Assistant / เมนูแบบจำลองการขาย", en: "Bot Assistant / Sales simulation menu" } },
          { id: "other", label: { th: "อื่น ๆ ระบุ", en: "Other (please specify)" }, isOther: true },
        ],
      },
      {
        id: "q8_most_helpful_menu",
        type: "radio",
        number: 8,
        title: { th: "เมนูใดที่ท่านคิดว่า “ช่วยงานขาย/งานบริการลูกค้า” ได้มากที่สุด", en: "Which menu do you think helps with sales / customer service the most?" },
        description: { th: "(เลือก 1 ข้อ)", en: "(Select 1)" },
        options: [
          { id: "messenger_online", label: { th: "Messenger Online", en: "Messenger Online" } },
          { id: "compliance_pdpa", label: { th: "Compliance & PDPA", en: "Compliance & PDPA" } },
          { id: "product_detail", label: { th: "รายละเอียดผลิตภัณฑ์", en: "Product details" } },
          { id: "installment_calc", label: { th: "เครื่องมือคำนวณค่างวด", en: "Installment calculator" } },
          { id: "performance", label: { th: "Sales Performance / Commission", en: "Sales Performance / Commission" } },
          { id: "welfare_list", label: { th: "Welfare List", en: "Welfare List" } },
          { id: "bot_assistant", label: { th: "Bot Assistant / แบบจำลองการขาย", en: "Bot Assistant / Sales simulation" } },
          { id: "other", label: { th: "อื่น ๆ ระบุ", en: "Other (please specify)" }, isOther: true },
        ],
        followUp: {
          id: "q8_reason",
          title: { th: "เหตุผลที่เลือกเมนูดังกล่าว", en: "Reason for your choice" },
          placeholder: { th: "ระบุเหตุผล", en: "Please describe your reason" },
          optional: true,
        },
      },
    ],
  },
  {
    id: "satisfaction",
    title: { th: "ส่วนที่ 3: ความพึงพอใจและประโยชน์ที่ได้รับ", en: "Part 3: Satisfaction & Benefits" },
    questions: [
      {
        id: "q9_satisfaction_matrix",
        type: "matrix",
        number: 9,
        title: { th: "กรุณาให้คะแนนความพึงพอใจต่อ CF BOT ในแต่ละด้าน", en: "Please rate your satisfaction with CF BOT in each area" },
        description: { th: "(1 = น้อยที่สุด, 5 = มากที่สุด)", en: "(1 = Lowest, 5 = Highest)" },
        rows: [
          { id: "ease_of_use", label: { th: "ความง่ายในการใช้งาน", en: "Ease of use" } },
          { id: "search_speed", label: { th: "ความรวดเร็วในการค้นหาข้อมูล", en: "Speed of finding information" } },
          { id: "data_accuracy", label: { th: "ความถูกต้องของข้อมูล", en: "Accuracy of information" } },
          { id: "menu_completeness", label: { th: "ความครบถ้วนของเมนู", en: "Completeness of menus" } },
          { id: "content_interest", label: { th: "ความน่าสนใจของ Content", en: "Interest level of content" } },
          { id: "sales_support", label: { th: "ความช่วยเหลือต่อการขาย/บริการลูกค้า", en: "Helpfulness for sales / customer service" } },
          { id: "overall", label: { th: "ความพึงพอใจโดยรวม", en: "Overall satisfaction" } },
        ],
      },
      {
        id: "q10_benefits",
        type: "checkbox",
        number: 10,
        title: { th: "ท่านคิดว่า CF BOT ช่วยงานของท่านในด้านใดบ้าง", en: "In what ways do you think CF BOT helps your work?" },
        description: { th: "(เลือกได้มากกว่า 1 ข้อ)", en: "(Select all that apply)" },
        options: [
          { id: "find_info_faster", label: { th: "ช่วยหาข้อมูลได้เร็วขึ้น", en: "Helps find information faster" } },
          { id: "less_repeat_questions", label: { th: "ช่วยลดการถามซ้ำจากหัวหน้า/ส่วนกลาง", en: "Reduces repeated questions to manager/HQ" } },
          { id: "more_accurate_answers", label: { th: "ช่วยให้ตอบลูกค้าได้ถูกต้องขึ้น", en: "Helps give more accurate answers to customers" } },
          { id: "less_compliance_error", label: { th: "ช่วยลดความผิดพลาดด้าน Compliance / PDPA", en: "Reduces Compliance / PDPA errors" } },
          { id: "track_performance", label: { th: "ช่วยติดตามผลงาน / Commission", en: "Helps track performance / commission" } },
          { id: "prepare_before_sales", label: { th: "ช่วยเตรียมตัวก่อนขาย", en: "Helps prepare before selling" } },
          { id: "more_confidence", label: { th: "ช่วยเพิ่มความมั่นใจในการคุยกับลูกค้า", en: "Increases confidence when talking to customers" } },
          { id: "no_clear_benefit", label: { th: "ยังไม่เห็นประโยชน์ชัดเจน", en: "No clear benefit yet" } },
          { id: "other", label: { th: "อื่น ๆ ระบุ", en: "Other (please specify)" }, isOther: true },
        ],
      },
    ],
  },
  {
    id: "content",
    title: { th: "ส่วนที่ 4: Broadcast / Content ที่สนใจ", en: "Part 4: Broadcast / Content Interests" },
    questions: [
      {
        id: "q11_broadcast_interest",
        type: "checkbox",
        number: 11,
        title: { th: "ท่านสนใจ Broadcast / ประกาศประเภทใดบ้าง", en: "Which types of broadcast/announcement are you interested in?" },
        description: { th: "(เลือกได้มากกว่า 1 ข้อ)", en: "(Select all that apply)" },
        options: [
          { id: "governance", label: { th: "Governance / Compliance / PDPA", en: "Governance / Compliance / PDPA" } },
          { id: "hq_announcement", label: { th: "ประกาศสำคัญจากส่วนกลาง", en: "Important announcements from HQ" } },
          { id: "dashboard", label: { th: "รายงาน / Dashboard / ข้อมูลผลงาน", en: "Reports / Dashboard / Performance data" } },
          { id: "customer_compliments", label: { th: "คำชมเชยจากลูกค้า", en: "Customer compliments" } },
          { id: "knowledge_video", label: { th: "VDO ความรู้ เช่น Governance Channel, พูดจาภาษา Sales, ศัพท์การเงิน", en: "Educational videos, e.g. Governance Channel, sales language, finance terms" } },
          { id: "infographic", label: { th: "Infographic / รูปภาพสรุปความรู้", en: "Infographics / knowledge summaries" } },
          { id: "podcast", label: { th: "Podcast พัฒนาชีวิต / ให้กำลังใจ", en: "Self-development / motivational podcasts" } },
          { id: "menu_guide", label: { th: "แนะนำการใช้เมนูต่าง ๆ ใน CF BOT", en: "Guides on how to use CF BOT menus" } },
          { id: "sales_tips", label: { th: "เทคนิคการขาย / Sales Tips", en: "Sales techniques / Sales tips" } },
          { id: "case_study", label: { th: "Case Study การขายจริง", en: "Real sales case studies" } },
          { id: "campaign", label: { th: "Campaign / Incentive / Promotion", en: "Campaigns / Incentives / Promotions" } },
          { id: "other", label: { th: "อื่น ๆ ระบุ", en: "Other (please specify)" }, isOther: true },
        ],
      },
      {
        id: "q12_top3_content",
        type: "ranking",
        number: 12,
        title: { th: "กรุณาเลือก 3 อันดับ Content / Broadcast ที่ท่านอยากได้รับมากที่สุด", en: "Please rank the top 3 types of content/broadcast you would like to receive most" },
        rankLabels: [
          { th: "อันดับ 1", en: "1st choice" },
          { th: "อันดับ 2", en: "2nd choice" },
          { th: "อันดับ 3", en: "3rd choice" },
        ],
      },
      {
        id: "q13_content_quality_matrix",
        type: "matrix",
        number: 13,
        title: { th: "กรุณาให้คะแนนคุณภาพ Content ที่ได้รับผ่าน CF BOT", en: "Please rate the quality of content received via CF BOT" },
        description: { th: "(1 = น้อยที่สุด, 5 = มากที่สุด)", en: "(1 = Lowest, 5 = Highest)" },
        rows: [
          { id: "easy_to_understand", label: { th: "เนื้อหาเข้าใจง่าย", en: "Content is easy to understand" } },
          { id: "applicable", label: { th: "นำไปใช้กับลูกค้าได้จริง", en: "Applicable when working with customers" } },
          { id: "appropriate_length", label: { th: "ความยาวเหมาะสม", en: "Appropriate length" } },
          { id: "engaging_format", label: { th: "รูปแบบน่าสนใจ", en: "Engaging format" } },
          { id: "appropriate_frequency", label: { th: "ความถี่ในการส่งเหมาะสม", en: "Appropriate sending frequency" } },
          { id: "up_to_date", label: { th: "ข้อมูลทันสมัย", en: "Up-to-date information" } },
        ],
      },
    ],
  },
  {
    id: "improvements",
    title: { th: "ส่วนที่ 5: ปัญหาและสิ่งที่ต้องการให้พัฒนาเพิ่มเติม", en: "Part 5: Issues & Suggested Improvements" },
    questions: [
      {
        id: "q14_problems",
        type: "checkbox",
        number: 14,
        title: { th: "ปัญหาที่ท่านพบในการใช้งาน CF BOT คืออะไร", en: "What problems have you encountered using CF BOT?" },
        description: { th: "(เลือกได้มากกว่า 1 ข้อ)", en: "(Select all that apply)" },
        options: [
          { id: "unaware_menu", label: { th: "ไม่ทราบว่ามีบางเมนูอยู่ในระบบ", en: "Unaware that some menus exist" } },
          { id: "cant_find_menu", label: { th: "หาเมนูไม่เจอ", en: "Can't find the menu" } },
          { id: "too_many_menus", label: { th: "เมนูเยอะเกินไป", en: "Too many menus" } },
          { id: "unclear_menu_names", label: { th: "ชื่อเมนูไม่ชัดเจน", en: "Menu names are unclear" } },
          { id: "incomplete_info", label: { th: "ข้อมูลไม่ครบถ้วน", en: "Information is incomplete" } },
          { id: "outdated_info", label: { th: "ข้อมูลไม่อัปเดต", en: "Information is outdated" } },
          { id: "bot_answer_mismatch", label: { th: "คำตอบจาก Bot ไม่ตรงคำถาม", en: "Bot's answer doesn't match the question" } },
          { id: "slow_loading", label: { th: "โหลดช้า / กดแล้วไม่ขึ้น", en: "Slow to load / unresponsive" } },
          { id: "hard_to_use", label: { th: "ใช้งานยาก", en: "Difficult to use" } },
          { id: "use_other_channel", label: { th: "ใช้ช่องทางอื่นแทน", en: "Use another channel instead" } },
          { id: "no_problem", label: { th: "ไม่มีปัญหา", en: "No problems" } },
          { id: "other", label: { th: "อื่น ๆ ระบุ", en: "Other (please specify)" }, isOther: true },
        ],
      },
      {
        id: "q15_top3_improvements",
        type: "checkboxLimit",
        number: 15,
        title: { th: "หากสามารถพัฒนา CF BOT ได้เพียง 3 เรื่อง ท่านอยากให้พัฒนาเรื่องใดก่อน", en: "If only 3 things could be improved in CF BOT, which would you prioritize?" },
        description: { th: "(เลือก 3 ข้อ)", en: "(Select up to 3)" },
        limit: 3,
        options: [
          { id: "easier_search", label: { th: "ปรับเมนูให้ค้นหาง่ายขึ้น", en: "Make menus easier to search" } },
          { id: "more_product_info", label: { th: "เพิ่มข้อมูลผลิตภัณฑ์", en: "Add more product information" } },
          { id: "more_calc_tools", label: { th: "เพิ่มเครื่องมือคำนวณ", en: "Add more calculation tools" } },
          { id: "sales_scripts", label: { th: "เพิ่มตัวอย่างบทสนทนาขาย / Sales Script", en: "Add sample sales conversations / scripts" } },
          { id: "objection_handling", label: { th: "เพิ่ม Objection Handling คำตอบเมื่อลูกค้าปฏิเสธ", en: "Add objection-handling responses" } },
          { id: "performance_dashboard", label: { th: "เพิ่ม Dashboard ผลงาน / Commission", en: "Add a performance/commission dashboard" } },
          { id: "campaign_info", label: { th: "เพิ่มข้อมูล Campaign / Incentive", en: "Add campaign/incentive information" } },
          { id: "short_videos", label: { th: "เพิ่ม VDO สั้น / Microlearning", en: "Add short videos / microlearning" } },
          { id: "infographics", label: { th: "เพิ่ม Infographic สรุปความรู้", en: "Add knowledge-summary infographics" } },
          { id: "smarter_bot", label: { th: "ปรับ Bot Assistant ให้ตอบแม่นขึ้น", en: "Make Bot Assistant answer more accurately" } },
          { id: "important_alerts", label: { th: "แจ้งเตือนข้อมูลสำคัญเฉพาะเรื่อง", en: "Send alerts for specific important topics" } },
          { id: "issue_request_channel", label: { th: "เพิ่มช่องทางแจ้งปัญหา / Request ข้อมูล", en: "Add a channel to report issues / request information" } },
          { id: "other", label: { th: "อื่น ๆ ระบุ", en: "Other (please specify)" }, isOther: true },
        ],
      },
      {
        id: "q16_desired_menu",
        type: "textarea",
        number: 16,
        title: { th: "ท่านต้องการให้เพิ่มเมนูใดใน CF BOT มากที่สุด เพราะเหตุใด", en: "What menu would you most like added to CF BOT, and why?" },
        placeholder: { th: "พิมพ์คำตอบของท่าน", en: "Type your answer" },
        optional: true,
      },
      {
        id: "q17_suggestions",
        type: "textarea",
        number: 17,
        title: { th: "ข้อเสนอแนะเพิ่มเติม หรือสิ่งที่อยากให้ CF BOT เป็นในอนาคต", en: "Any additional suggestions, or what you'd like CF BOT to become in the future" },
        placeholder: { th: "พิมพ์คำตอบของท่าน", en: "Type your answer" },
        optional: true,
      },
    ],
  },
];

export const UI_TEXT = {
  startTitle: { th: "พร้อมหรือยัง?", en: "Ready to begin?" },
  startButton: { th: "เริ่มทำแบบสอบถาม", en: "Start the survey" },
  estTime: { th: "ใช้เวลาประมาณ 3-5 นาที", en: "Takes about 3–5 minutes" },
  next: { th: "ถัดไป", en: "Next" },
  back: { th: "ย้อนกลับ", en: "Back" },
  submit: { th: "ส่งแบบสอบถาม", en: "Submit" },
  required: { th: "จำเป็นต้องตอบ", en: "Required" },
  optional: { th: "ไม่บังคับ", en: "Optional" },
  step: { th: "ส่วนที่", en: "Part" },
  of: { th: "จาก", en: "of" },
  selectUpTo: { th: "เลือกได้สูงสุด", en: "Select up to" },
  items: { th: "ข้อ", en: "items" },
  thankYouTitle: { th: "ขอบคุณค่ะ / ครับ!", en: "Thank you!" },
  backToHome: { th: "กลับสู่หน้าแรก", en: "Back to home" },
  errorRequired: { th: "กรุณาตอบคำถามนี้ก่อนไปต่อ", en: "Please answer this question before continuing" },
  errorRequiredSection: {
    th: "กรุณาตอบคำถามที่มีเครื่องหมาย * ให้ครบทุกข้อก่อนไปต่อ",
    en: "Please answer all questions marked with * before continuing",
  },
  submitError: {
    th: "เกิดข้อผิดพลาดในการส่งแบบสอบถาม กรุณาลองใหม่อีกครั้ง",
    en: "Something went wrong submitting your feedback. Please try again.",
  },
};
