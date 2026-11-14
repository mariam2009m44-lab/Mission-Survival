import {DAYS,COPY} from "./data.js";

// The challenge is a five-day mission, not five decisions compressed into three days.
// Keep the five existing science decisions and give each its own mission day.
const dayTitles = [
  ["Day 1 · Earth departure and payload planning","اليوم الأول · الاستعداد والانطلاق"],
  ["Day 2 · Oxygen from lunar regolith","اليوم الثاني · استخلاص الأكسجين من تربة القمر"],
  ["Day 3 · Solar alert and crew protection","اليوم الثالث · التنبيه الشمسي وحماية الطاقم"],
  ["Day 4 · Water recovery and life support","اليوم الرابع · استعادة المياه ودعم الحياة"],
  ["Day 5 · Food strategy and greenhouse","اليوم الخامس · استراتيجية الغذاء والبيت الزجاجي"]
];

DAYS.forEach((stage,index)=>{
  stage.dayNumber=index+1;
  stage.part=1;
  stage.title=dayTitles[index][0];
  stage.ar=dayTitles[index][1];
});

DAYS[3].story="On the fourth day, the crew reviews the life-support loop after the previous day's alert. Water is precious, and recovery systems need electricity, clean filters and maintenance.";
DAYS[3].arStory="في اليوم الرابع، يراجع الطاقم دورة دعم الحياة بعد تنبيه اليوم السابق. المياه مورد ثمين، وأنظمة الاستعادة تحتاج إلى الكهرباء والفلاتر النظيفة والصيانة.";
DAYS[3].task="Choose how to recover or conserve the remaining water.";
DAYS[3].arTask="اختاري طريقة لاستعادة المياه المتبقية أو ترشيد استخدامها.";

DAYS[4].story="On the fifth day, the outpost checks its food reserves. Decide whether to invest in a long-term greenhouse trial or rely on ready-to-eat supplies before the final mission review.";
DAYS[4].arStory="في اليوم الخامس، تراجع القاعدة مخزون الغذاء. قرري هل تستثمرين في تجربة بيت زجاجي طويلة المدى أم تعتمدين على الوجبات الجاهزة قبل التقرير النهائي للمهمة.";
DAYS[4].task="Make the final food-supply decision for the outpost.";
DAYS[4].arTask="اتخذي القرار النهائي بشأن إمدادات الغذاء في القاعدة.";

COPY.en.missionSub="Lead a five-day lunar outpost exercise. Game units are illustrative, not spacecraft telemetry.";
COPY.ar.missionSub="قودي تدريبًا لقاعدة قمرية لمدة خمسة أيام. وحدات اللعبة توضيحية وليست قياسات مركبة فضائية.";
COPY.en.noReport="Complete the five-day mission to generate your report.";
COPY.ar.noReport="أكملي المهمة ذات الأيام الخمسة لإنشاء التقرير.";
