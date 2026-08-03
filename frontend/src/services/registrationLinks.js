const IBS_BBA_URL = "https://www.iudehradun.edu.in/admissions/online-registration";
const IBS_MBA_URL =
    "https://www.iudehradun.edu.in/admissions/online-registration";
const IBS_EMBA_URL = "https://www.iudehradun.edu.in/admissions/online-registration";
const IBS_PHD_URL = "https://www.iudehradun.edu.in/admissions/online-registration";

const ICFAITECH_UG_URL = "https://www.iudehradun.edu.in/admissions/online-registration";
const ICFAITECH_PG_URL = "https://www.iudehradun.edu.in/admissions/online-registration";
const ICFAITECH_PHD_URL = "https://www.iudehradun.edu.in/admissions/online-registration";

const LAW_UG_URL = "https://www.iudehradun.edu.in/admissions/online-registration";
const LAW_LLM_URL = "https://www.iudehradun.edu.in/admissions/online-registration";
const LAW_PHD_URL = "https://www.iudehradun.edu.in/admissions/online-registration";

const ARCH_URL = "https://www.iudehradun.edu.in/admissions/online-registration";

const ISOSS_URL = "https://www.iudehradun.edu.in/admissions/online-registration";
const ISOSS_PHD_ECON_URL =
    "https://www.iudehradun.edu.in/admissions/online-registration";
const ISOSS_PHD_DSPP_URL =
    "https://www.iudehradun.edu.in/admissions/online-registration";

const ONLINE_BBA_URL = "https://www.iudehradun.edu.in/admissions/online-registration";
const ONLINE_MBA_URL = "https://www.iudehradun.edu.in/admissions/online-registration";
const DISTANCE_BBA_URL = "https://www.iudehradun.edu.in/admissions/online-registration";
const DISTANCE_MBA_URL = "https://www.iudehradun.edu.in/admissions/online-registration";
const APPLICANT_LOGIN_URL = "https://www.iudehradun.edu.in/admissions/online-registration";

function buildResponse(program, url) {
    return `You can apply for the ${program} program here: ${url}`;
}

const REGISTRATION_LINKS = [
    {
        id: "ibs_bba",
        program: "BBA",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "BBA",
            "IBS BBA",
            "Bachelor of Business Administration",
            "BBA General",
            "BBA Hyderabad"
        ],
        keywords: ["bba", "business", "management", "administration", "ibs"],
        registration_url: IBS_BBA_URL,
        response: buildResponse("BBA", IBS_BBA_URL)
    },
    {
        id: "ibs_bba_ai_ds",
        program: "BBA (Artificial Intelligence & Data Science)",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "BBA AI DS",
            "BBA Artificial Intelligence Data Science",
            "BBA AI and Data Science",
            "BBA in AI DS",
            "Bachelor of Business Administration AI DS"
        ],
        keywords: [
            "bba",
            "ai",
            "data science",
            "artificial intelligence",
            "business",
            "management"
        ],
        registration_url: IBS_BBA_URL,
        response: buildResponse("BBA (Artificial Intelligence & Data Science)", IBS_BBA_URL)
    },
    {
        id: "ibs_bba_ccs",
        program: "BBA (Cloud Computing & Cyber Security)",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "BBA Cloud Computing",
            "BBA Cyber Security",
            "BBA CCS",
            "BBA Cloud Computing and Cyber Security",
            "Bachelor of Business Administration Cyber Security"
        ],
        keywords: [
            "bba",
            "cloud",
            "cyber security",
            "cybersecurity",
            "business",
            "management"
        ],
        registration_url: IBS_BBA_URL,
        response: buildResponse("BBA (Cloud Computing & Cyber Security)", IBS_BBA_URL)
    },
    {
        id: "ibs_mba",
        program: "MBA",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "MBA",
            "IBS MBA",
            "Master of Business Administration",
            "MBA General",
            "MBA Hyderabad"
        ],
        keywords: ["mba", "business", "management", "administration", "ibs", "master"],
        registration_url: IBS_MBA_URL,
        response: buildResponse("MBA", IBS_MBA_URL)
    },
    {
        id: "ibs_mba_finance",
        program: "MBA (Finance)",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "MBA Finance",
            "MBA in Finance",
            "Master of Business Administration Finance"
        ],
        keywords: ["mba", "finance", "business", "management"],
        registration_url: IBS_MBA_URL,
        response: buildResponse("MBA (Finance)", IBS_MBA_URL)
    },
    {
        id: "ibs_mba_marketing",
        program: "MBA (Marketing)",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "MBA Marketing",
            "MBA in Marketing",
            "Master of Business Administration Marketing"
        ],
        keywords: ["mba", "marketing", "business", "management"],
        registration_url: IBS_MBA_URL,
        response: buildResponse("MBA (Marketing)", IBS_MBA_URL)
    },
    {
        id: "ibs_mba_hr",
        program: "MBA (Human Resource Management)",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "MBA HR",
            "MBA Human Resource Management",
            "MBA Human Resources",
            "Master of Business Administration HR"
        ],
        keywords: ["mba", "hr", "human resource", "business", "management"],
        registration_url: IBS_MBA_URL,
        response: buildResponse("MBA (Human Resource Management)", IBS_MBA_URL)
    },
    {
        id: "ibs_mba_business_analytics",
        program: "MBA (Business Analytics)",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "MBA Business Analytics",
            "MBA Analytics",
            "MBA in Business Analytics"
        ],
        keywords: ["mba", "analytics", "business", "data", "management"],
        registration_url: IBS_MBA_URL,
        response: buildResponse("MBA (Business Analytics)", IBS_MBA_URL)
    },
    {
        id: "ibs_mba_banking_insurance",
        program: "MBA (Banking & Insurance)",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "MBA Banking",
            "MBA Insurance",
            "MBA Banking and Insurance",
            "MBA Banking & Insurance"
        ],
        keywords: ["mba", "banking", "insurance", "finance", "business", "management"],
        registration_url: IBS_MBA_URL,
        response: buildResponse("MBA (Banking & Insurance)", IBS_MBA_URL)
    },
    {
        id: "ibs_mba_operations",
        program: "MBA (Operations Management)",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "MBA Operations",
            "MBA Operations Management",
            "MBA in Operations"
        ],
        keywords: ["mba", "operations", "business", "management", "supply chain"],
        registration_url: IBS_MBA_URL,
        response: buildResponse("MBA (Operations Management)", IBS_MBA_URL)
    },
    {
        id: "ibs_mba_it",
        program: "MBA (Information Technology)",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "MBA IT",
            "MBA Information Technology",
            "MBA in IT"
        ],
        keywords: ["mba", "it", "information technology", "business", "management"],
        registration_url: IBS_MBA_URL,
        response: buildResponse("MBA (Information Technology)", IBS_MBA_URL)
    },
    {
        id: "ibs_executive_mba",
        program: "Executive MBA (Part-time)",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "Executive MBA",
            "EMBA",
            "Part-time MBA",
            "Executive MBA Part-time",
            "Working Professional MBA"
        ],
        keywords: ["executive mba", "emba", "part time", "mba", "working professional"],
        registration_url: IBS_EMBA_URL,
        response: buildResponse("Executive MBA (Part-time)", IBS_EMBA_URL)
    },
    {
        id: "ibs_phd_management",
        program: "Ph.D (Management)",
        school: "ICFAI Business School (IBS)",
        aliases: [
            "PhD Management",
            "Ph.D in Management",
            "Doctorate Management",
            "Doctor of Philosophy Management",
            "Research Management"
        ],
        keywords: ["phd", "doctorate", "management", "research", "business"],
        registration_url: IBS_PHD_URL,
        response: buildResponse("Ph.D (Management)", IBS_PHD_URL)
    },
    {
        id: "icfaitech_btech",
        program: "B.Tech",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech",
            "BTech",
            "Bachelor of Technology",
            "Engineering",
            "B.Tech General"
        ],
        keywords: ["btech", "engineering", "technology", "bachelor"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_cse",
        program: "B.Tech (Computer Science Engineering)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech CSE",
            "BTech CSE",
            "Computer Science Engineering",
            "Computer Science",
            "CSE"
        ],
        keywords: ["btech", "cse", "computer science", "engineering", "computer"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Computer Science Engineering)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_ai",
        program: "B.Tech (Artificial Intelligence)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech AI",
            "BTech Artificial Intelligence",
            "Artificial Intelligence",
            "AI",
            "B.Tech in AI"
        ],
        keywords: ["btech", "ai", "artificial intelligence", "engineering"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Artificial Intelligence)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_aiml",
        program: "B.Tech (Artificial Intelligence & Machine Learning)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech AIML",
            "BTech AI ML",
            "Artificial Intelligence and Machine Learning",
            "AI ML",
            "Machine Learning"
        ],
        keywords: ["btech", "ai", "ml", "machine learning", "artificial intelligence", "engineering"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Artificial Intelligence & Machine Learning)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_aids",
        program: "B.Tech (Artificial Intelligence & Data Science)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech AI DS",
            "BTech AI Data Science",
            "Artificial Intelligence and Data Science",
            "AI DS"
        ],
        keywords: ["btech", "ai", "data science", "artificial intelligence", "engineering"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Artificial Intelligence & Data Science)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_ds",
        program: "B.Tech (Data Science)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech Data Science",
            "BTech DS",
            "Data Science",
            "B.Tech in Data Science"
        ],
        keywords: ["btech", "data science", "data", "engineering"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Data Science)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_cyber",
        program: "B.Tech (Cyber Security)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech Cyber Security",
            "BTech Cybersecurity",
            "Cyber Security",
            "Cybersecurity",
            "B.Tech in Cyber Security"
        ],
        keywords: ["btech", "cyber security", "cybersecurity", "security", "engineering"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Cyber Security)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_it",
        program: "B.Tech (Information Technology)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech IT",
            "BTech Information Technology",
            "Information Technology",
            "IT Engineering"
        ],
        keywords: ["btech", "it", "information technology", "engineering"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Information Technology)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_ece",
        program: "B.Tech (Electronics & Communication Engineering)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech ECE",
            "BTech Electronics Communication",
            "Electronics and Communication Engineering",
            "ECE"
        ],
        keywords: ["btech", "ece", "electronics", "communication", "engineering"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Electronics & Communication Engineering)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_eee",
        program: "B.Tech (Electrical & Electronics Engineering)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech EEE",
            "BTech Electrical Electronics",
            "Electrical and Electronics Engineering",
            "EEE"
        ],
        keywords: ["btech", "eee", "electrical", "electronics", "engineering"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Electrical & Electronics Engineering)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_mech",
        program: "B.Tech (Mechanical Engineering)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech Mechanical",
            "BTech Mechanical Engineering",
            "Mechanical Engineering",
            "Mech"
        ],
        keywords: ["btech", "mechanical", "engineering"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Mechanical Engineering)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_civil",
        program: "B.Tech (Civil Engineering)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech Civil",
            "BTech Civil Engineering",
            "Civil Engineering"
        ],
        keywords: ["btech", "civil", "engineering", "construction"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Civil Engineering)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_vlsi",
        program: "B.Tech (VLSI)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech VLSI",
            "BTech VLSI",
            "VLSI",
            "VLSI Design",
            "Very Large Scale Integration"
        ],
        keywords: ["btech", "vlsi", "chip design", "engineering", "semiconductor"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (VLSI)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_robotics",
        program: "B.Tech (Robotics)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech Robotics",
            "BTech Robotics",
            "Robotics",
            "Robotics Engineering"
        ],
        keywords: ["btech", "robotics", "robots", "engineering", "automation"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Robotics)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_semiconductor",
        program: "B.Tech (Semiconductor)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech Semiconductor",
            "BTech Semiconductor",
            "Semiconductor",
            "Semiconductor Technology"
        ],
        keywords: ["btech", "semiconductor", "chip", "engineering", "electronics"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Semiconductor)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_iot",
        program: "B.Tech (IoT)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech IoT",
            "BTech Internet of Things",
            "IoT",
            "Internet of Things"
        ],
        keywords: ["btech", "iot", "internet of things", "engineering"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (IoT)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_btech_computer_engg",
        program: "B.Tech (Computer Engineering)",
        school: "ICFAI Tech School",
        aliases: [
            "B.Tech Computer Engineering",
            "BTech Computer Engineering",
            "Computer Engineering"
        ],
        keywords: ["btech", "computer engineering", "engineering", "computer"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Tech (Computer Engineering)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_bca_aiml",
        program: "BCA AI & ML (Hons.)",
        school: "ICFAI Tech School",
        aliases: [
            "BCA AI ML",
            "BCA Artificial Intelligence Machine Learning",
            "Bachelor of Computer Applications AI ML"
        ],
        keywords: ["bca", "ai", "ml", "machine learning", "computer applications"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("BCA AI & ML (Hons.)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_bca_aids",
        program: "BCA AI & DS (Hons.)",
        school: "ICFAI Tech School",
        aliases: [
            "BCA AI DS",
            "BCA Artificial Intelligence Data Science",
            "Bachelor of Computer Applications AI DS"
        ],
        keywords: ["bca", "ai", "data science", "computer applications"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("BCA AI & DS (Hons.)", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_bsc_robotics_ai",
        program: "B.Sc Robotics & AI",
        school: "ICFAI Tech School",
        aliases: [
            "BSc Robotics AI",
            "B.Sc Robotics and AI",
            "Bachelor of Science Robotics AI"
        ],
        keywords: ["bsc", "robotics", "ai", "artificial intelligence", "science"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Sc Robotics & AI", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_bsc_data_analytics",
        program: "B.Sc Data Analytics",
        school: "ICFAI Tech School",
        aliases: [
            "BSc Data Analytics",
            "B.Sc in Data Analytics",
            "Bachelor of Science Data Analytics"
        ],
        keywords: ["bsc", "data analytics", "data", "science"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Sc Data Analytics", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_bsc_cs",
        program: "B.Sc Computer Science",
        school: "ICFAI Tech School",
        aliases: [
            "BSc Computer Science",
            "B.Sc CS",
            "Bachelor of Science Computer Science"
        ],
        keywords: ["bsc", "computer science", "science", "computer"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Sc Computer Science", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_bsc_physics",
        program: "B.Sc Physics",
        school: "ICFAI Tech School",
        aliases: [
            "BSc Physics",
            "B.Sc in Physics",
            "Bachelor of Science Physics"
        ],
        keywords: ["bsc", "physics", "science"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Sc Physics", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_bsc_mathematics",
        program: "B.Sc Mathematics",
        school: "ICFAI Tech School",
        aliases: [
            "BSc Mathematics",
            "B.Sc Maths",
            "Bachelor of Science Mathematics"
        ],
        keywords: ["bsc", "mathematics", "maths", "science"],
        registration_url: ICFAITECH_UG_URL,
        response: buildResponse("B.Sc Mathematics", ICFAITECH_UG_URL)
    },
    {
        id: "icfaitech_mtech",
        program: "M.Tech",
        school: "ICFAI Tech School",
        aliases: [
            "M.Tech",
            "MTech",
            "Master of Technology",
            "M.Tech General"
        ],
        keywords: ["mtech", "master", "technology", "engineering"],
        registration_url: ICFAITECH_PG_URL,
        response: buildResponse("M.Tech", ICFAITECH_PG_URL)
    },
    {
        id: "icfaitech_mtech_cse",
        program: "M.Tech (Computer Science Engineering)",
        school: "ICFAI Tech School",
        aliases: [
            "M.Tech CSE",
            "MTech Computer Science",
            "Master of Technology Computer Science Engineering"
        ],
        keywords: ["mtech", "cse", "computer science", "engineering"],
        registration_url: ICFAITECH_PG_URL,
        response: buildResponse("M.Tech (Computer Science Engineering)", ICFAITECH_PG_URL)
    },
    {
        id: "icfaitech_mtech_vlsi",
        program: "M.Tech (VLSI Design)",
        school: "ICFAI Tech School",
        aliases: [
            "M.Tech VLSI",
            "MTech VLSI Design",
            "Master of Technology VLSI"
        ],
        keywords: ["mtech", "vlsi", "chip design", "engineering"],
        registration_url: ICFAITECH_PG_URL,
        response: buildResponse("M.Tech (VLSI Design)", ICFAITECH_PG_URL)
    },
    {
        id: "icfaitech_msc_tech",
        program: "M.Sc (Tech)",
        school: "ICFAI Tech School",
        aliases: [
            "MSc Tech",
            "M.Sc Technology",
            "Master of Science Tech"
        ],
        keywords: ["msc", "tech", "technology", "master", "science"],
        registration_url: ICFAITECH_PG_URL,
        response: buildResponse("M.Sc (Tech)", ICFAITECH_PG_URL)
    },
    {
        id: "icfaitech_phd_engineering",
        program: "Ph.D (Engineering)",
        school: "ICFAI Tech School",
        aliases: [
            "PhD Engineering",
            "Ph.D in Engineering",
            "Doctorate Engineering",
            "Doctor of Philosophy Engineering"
        ],
        keywords: ["phd", "doctorate", "engineering", "research", "technology"],
        registration_url: ICFAITECH_PHD_URL,
        response: buildResponse("Ph.D (Engineering)", ICFAITECH_PHD_URL)
    },
    {
        id: "icfaitech_phd_basic_sciences",
        program: "Ph.D (Basic Sciences & Humanities)",
        school: "ICFAI Tech School",
        aliases: [
            "PhD Basic Sciences",
            "Ph.D Humanities",
            "Ph.D Basic Sciences and Humanities",
            "Doctorate Basic Sciences"
        ],
        keywords: ["phd", "doctorate", "basic sciences", "humanities", "research", "science"],
        registration_url: ICFAITECH_PHD_URL,
        response: buildResponse("Ph.D (Basic Sciences & Humanities)", ICFAITECH_PHD_URL)
    },
    {
        id: "isoss_ba_economics",
        program: "BA Economics",
        school: "ICFAI School of Social Sciences",
        aliases: [
            "BA Economics",
            "Bachelor of Arts Economics",
            "BA in Economics",
            "Economics"
        ],
        keywords: ["ba", "economics", "arts", "social science"],
        registration_url: ISOSS_URL,
        response: buildResponse("BA Economics", ISOSS_URL)
    },
    {
        id: "isoss_bsc_psychology",
        program: "B.Sc Psychology",
        school: "ICFAI School of Social Sciences",
        aliases: [
            "BSc Psychology",
            "B.Sc in Psychology",
            "Psychology",
            "Bachelor of Science Psychology"
        ],
        keywords: ["bsc", "psychology", "science", "social science"],
        registration_url: ISOSS_URL,
        response: buildResponse("B.Sc Psychology", ISOSS_URL)
    },
    {
        id: "isoss_bsc_economics_data_science",
        program: "B.Sc Economics & Data Science",
        school: "ICFAI School of Social Sciences",
        aliases: [
            "BSc Economics Data Science",
            "B.Sc Economics and Data Science",
            "Economics Data Science"
        ],
        keywords: ["bsc", "economics", "data science", "science"],
        registration_url: ISOSS_URL,
        response: buildResponse("B.Sc Economics & Data Science", ISOSS_URL)
    },
    {
        id: "isoss_bcom",
        program: "B.Com",
        school: "ICFAI School of Social Sciences",
        aliases: [
            "BCom",
            "B.Com",
            "Bachelor of Commerce",
            "Commerce"
        ],
        keywords: ["bcom", "commerce", "accounting", "finance"],
        registration_url: ISOSS_URL,
        response: buildResponse("B.Com", ISOSS_URL)
    },
    {
        id: "isoss_msc_economics",
        program: "M.Sc Economics",
        school: "ICFAI School of Social Sciences",
        aliases: [
            "MSc Economics",
            "M.Sc in Economics",
            "Master of Science Economics"
        ],
        keywords: ["msc", "economics", "master", "science"],
        registration_url: ISOSS_URL,
        response: buildResponse("M.Sc Economics", ISOSS_URL)
    },
    {
        id: "isoss_phd_economics",
        program: "Ph.D Economics",
        school: "ICFAI School of Social Sciences",
        aliases: [
            "PhD Economics",
            "Ph.D in Economics",
            "Doctorate Economics"
        ],
        keywords: ["phd", "doctorate", "economics", "research"],
        registration_url: ISOSS_PHD_ECON_URL,
        response: buildResponse("Ph.D Economics", ISOSS_PHD_ECON_URL)
    },
    {
        id: "isoss_phd_development_studies",
        program: "Ph.D Development Studies & Public Policy",
        school: "ICFAI School of Social Sciences",
        aliases: [
            "PhD Development Studies",
            "Ph.D Public Policy",
            "Ph.D Development Studies and Public Policy",
            "Doctorate Public Policy"
        ],
        keywords: ["phd", "doctorate", "development studies", "public policy", "research"],
        registration_url: ISOSS_PHD_DSPP_URL,
        response: buildResponse("Ph.D Development Studies & Public Policy", ISOSS_PHD_DSPP_URL)
    },
    {
        id: "law_bba_llb",
        program: "BBA LLB (Hons.)",
        school: "ICFAI Law School",
        aliases: [
            "BBA LLB",
            "BBA LLB Hons",
            "Bachelor of Business Administration LLB"
        ],
        keywords: ["law", "llb", "bba", "legal"],
        registration_url: LAW_UG_URL,
        response: buildResponse("BBA LLB (Hons.)", LAW_UG_URL)
    },
    {
        id: "law_ba_llb",
        program: "BA LLB (Hons.)",
        school: "ICFAI Law School",
        aliases: [
            "BA LLB",
            "BA LLB Hons",
            "Bachelor of Arts LLB"
        ],
        keywords: ["law", "llb", "ba", "legal"],
        registration_url: LAW_UG_URL,
        response: buildResponse("BA LLB (Hons.)", LAW_UG_URL)
    },
    {
        id: "law_baj_llb",
        program: "BAJ LLB (Hons.)",
        school: "ICFAI Law School",
        aliases: [
            "BAJ LLB",
            "BAJ LLB Hons",
            "Bachelor of Arts Journalism LLB",
            "Journalism Law"
        ],
        keywords: ["law", "llb", "baj", "journalism", "legal"],
        registration_url: LAW_UG_URL,
        response: buildResponse("BAJ LLB (Hons.)", LAW_UG_URL)
    },
    {
        id: "law_llm",
        program: "LLM (1 Year)",
        school: "ICFAI Law School",
        aliases: [
            "LLM",
            "Master of Law",
            "LLM One Year",
            "Master of Laws"
        ],
        keywords: ["law", "llm", "master", "legal"],
        registration_url: LAW_LLM_URL,
        response: buildResponse("LLM (1 Year)", LAW_LLM_URL)
    },
    {
        id: "law_phd",
        program: "Ph.D (Law)",
        school: "ICFAI Law School",
        aliases: [
            "PhD Law",
            "Ph.D in Law",
            "Doctorate Law",
            "Doctor of Philosophy Law"
        ],
        keywords: ["phd", "doctorate", "law", "legal", "research"],
        registration_url: LAW_PHD_URL,
        response: buildResponse("Ph.D (Law)", LAW_PHD_URL)
    },
    {
        id: "arch_barch",
        program: "B.Arch",
        school: "ICFAI School of Architecture (ISArch)",
        aliases: [
            "B.Arch",
            "BArch",
            "Bachelor of Architecture",
            "Architecture"
        ],
        keywords: ["architecture", "barch", "design", "isarch"],
        registration_url: ARCH_URL,
        response: buildResponse("B.Arch", ARCH_URL)
    },
    {
        id: "cdoe_distance_mba",
        program: "Distance MBA",
        school: "Centre for Distance & Online Education",
        aliases: [
            "Distance MBA",
            "MBA Distance",
            "MBA Distance Education",
            "Correspondence MBA"
        ],
        keywords: ["distance", "mba", "correspondence", "business"],
        registration_url: DISTANCE_MBA_URL,
        response: buildResponse("Distance MBA", DISTANCE_MBA_URL)
    },
    {
        id: "cdoe_distance_bba",
        program: "Distance BBA",
        school: "Centre for Distance & Online Education",
        aliases: [
            "Distance BBA",
            "BBA Distance",
            "BBA Distance Education",
            "Correspondence BBA"
        ],
        keywords: ["distance", "bba", "correspondence", "business"],
        registration_url: DISTANCE_BBA_URL,
        response: buildResponse("Distance BBA", DISTANCE_BBA_URL)
    },
    {
        id: "online_bba",
        program: "Online BBA",
        school: "Online Programs",
        aliases: [
            "Online BBA",
            "BBA Online",
            "Bachelor of Business Administration Online"
        ],
        keywords: ["online", "bba", "business", "distance learning"],
        registration_url: ONLINE_BBA_URL,
        response: buildResponse("Online BBA", ONLINE_BBA_URL)
    },
    {
        id: "online_mba",
        program: "Online MBA",
        school: "Online Programs",
        aliases: [
            "Online MBA",
            "MBA Online",
            "Master of Business Administration Online"
        ],
        keywords: ["online", "mba", "business", "distance learning"],
        registration_url: ONLINE_MBA_URL,
        response: buildResponse("Online MBA", ONLINE_MBA_URL)
    },
    {
        id: "applicant_login",
        program: "Existing Applicant Login",
        school: "Applicant Login",
        aliases: [
            "Applicant Login",
            "Existing Applicant Login",
            "Login",
            "Student Login",
            "Existing Applicant"
        ],
        keywords: ["login", "applicant", "existing", "account", "portal"],
        registration_url: APPLICANT_LOGIN_URL,
        response: buildResponse("Existing Applicant Login", APPLICANT_LOGIN_URL)
    }
];

function normalize(text) {
    return text
        ?.toLowerCase()
        .replace(/[\s\W]+/g, " ")
        .trim() || "";
}

function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= b.length; j += 1) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= a.length; i += 1) {
        for (let j = 1; j <= b.length; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[a.length][b.length];
}

function similarityScore(a, b) {
    const distance = levenshteinDistance(a, b);
    const maxLength = Math.max(a.length, b.length);
    if (maxLength === 0) {
        return 1;
    }
    return 1 - distance / maxLength;
}

export function findRegistrationLink(program) {
    if (!program) {
        return null;
    }

    const query = normalize(
        typeof program === "string"
            ? program
            : program.name || program.program || program.id || program.school || ""
    );
    if (!query) {
        return null;
    }

    const normalizedProgramId = normalize(typeof program === "object" ? program.id : "");
    const normalizedSchool = normalize(typeof program === "object" ? program.school : "");
    const haystack = `${query} ${normalizedSchool}`.trim();

    for (const entry of REGISTRATION_LINKS) {
        if (
            (normalizedProgramId && normalize(entry.id) === normalizedProgramId) ||
            normalize(entry.program) === query ||
            normalize(entry.school) === query
        ) {
            return entry;
        }
        for (const alias of entry.aliases) {
            if (normalize(alias) === query) {
                return entry;
            }
        }
    }

    let bestSubstringMatch = null;
    let bestSubstringRatio = 0;
    for (const entry of REGISTRATION_LINKS) {
        const candidates = [entry.program, entry.school, entry.id, ...entry.aliases];
        for (const candidate of candidates) {
            const normalizedCandidate = normalize(candidate);
            if (!normalizedCandidate) {
                continue;
            }
            if (
                normalizedCandidate.includes(query) ||
                query.includes(normalizedCandidate) ||
                haystack.includes(normalizedCandidate)
            ) {
                const shorter = Math.min(query.length, normalizedCandidate.length);
                const longer = Math.max(query.length, normalizedCandidate.length);
                const ratio = shorter / longer;
                if (ratio > bestSubstringRatio) {
                    bestSubstringRatio = ratio;
                    bestSubstringMatch = entry;
                }
            }
        }
    }
    if (bestSubstringMatch) {
        return bestSubstringMatch;
    }

    const queryWords = query.split(" ").filter(Boolean);
    let bestKeywordEntry = null;
    let bestKeywordScore = 0;
    for (const entry of REGISTRATION_LINKS) {
        const normalizedKeywords = entry.keywords.map((keyword) => normalize(keyword));
        let score = 0;
        for (const word of queryWords) {
            if (normalizedKeywords.some((keyword) => keyword === word || keyword.includes(word))) {
                score += 1;
            }
        }
        if (score > bestKeywordScore) {
            bestKeywordScore = score;
            bestKeywordEntry = entry;
        }
    }
    if (bestKeywordEntry && bestKeywordScore > 0) {
        return bestKeywordEntry;
    }

    let bestFuzzyEntry = null;
    let bestFuzzyScore = 0;
    for (const entry of REGISTRATION_LINKS) {
        const candidates = [entry.program, entry.school, ...entry.aliases];
        for (const candidate of candidates) {
            const normalizedCandidate = normalize(candidate);
            const score = similarityScore(query, normalizedCandidate);
            if (score > bestFuzzyScore) {
                bestFuzzyScore = score;
                bestFuzzyEntry = entry;
            }
        }
    }
    if (bestFuzzyEntry && bestFuzzyScore >= 0.6) {
        return bestFuzzyEntry;
    }

    return null;
}

export function getRegistrationResponse(program) {
    const entry = findRegistrationLink(program);
    if (!entry) {
        return "I couldn't find a matching program. Could you please specify the exact program name, such as BBA, MBA, B.Tech, or Ph.D?";
    }
    return entry.response;
}

export default REGISTRATION_LINKS;