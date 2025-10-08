
import { GameRole, FinalCard } from '@/types/gameTypes';
import { colors } from '@/styles/commonStyles';

export const gameRoles: GameRole[] = [
  // City Roles (شهر)
  {
    id: 'doctor',
    name: 'دکتر',
    description: [
      'هر شب می‌تواند یک نفر را نجات دهد',
      'نمی‌تواند خودش را نجات دهد',
      'اگر کسی که نجات داده شلیک شده باشد، زنده می‌ماند'
    ],
    team: 'city',
    color: colors.primary,
    abilities: ['heal']
  },
  {
    id: 'detective',
    name: 'کارآگاه',
    description: [
      'هر شب می‌تواند هویت یک نفر را بپرسد',
      'گاد به او می‌گوید آن شخص مافیا است یا نه',
      'اطلاعات مهمی برای شهر جمع‌آوری می‌کند'
    ],
    team: 'city',
    color: colors.primary,
    abilities: ['investigate']
  },
  {
    id: 'sniper',
    name: 'تک‌تیرانداز',
    description: [
      'یک بار در کل بازی می‌تواند شلیک کند',
      'اگر مافیا بزند، مافیا می‌میرد',
      'اگر شهروند بزند، خودش می‌میرد'
    ],
    team: 'city',
    color: colors.primary,
    abilities: ['shoot_once']
  },
  {
    id: 'bodyguard',
    name: 'محافظ',
    description: [
      'هر شب می‌تواند یک نفر را محافظت کند',
      'اگر آن شخص شلیک شود، محافظ به جایش می‌میرد',
      'نمی‌تواند خودش را محافظت کند'
    ],
    team: 'city',
    color: colors.primary,
    abilities: ['protect']
  },

  // Mafia Roles (مافیا)
  {
    id: 'godfather',
    name: 'پدرخوانده',
    description: [
      'رهبر مافیا و تصمیم‌گیرنده نهایی',
      'برای کارآگاه به عنوان شهروند شناخته می‌شود',
      'اگر بمیرد، مافیا ضعیف می‌شود'
    ],
    team: 'mafia',
    color: colors.secondary,
    abilities: ['lead_mafia', 'appear_innocent']
  },
  {
    id: 'mafia_simple',
    name: 'مافیای ساده',
    description: [
      'عضو معمولی مافیا',
      'در شب با سایر مافیاها مشورت می‌کند',
      'هدف: از مافیا دفاع کند و شهروندان را حذف کند'
    ],
    team: 'mafia',
    color: colors.secondary,
    abilities: ['vote_kill']
  },
  {
    id: 'mafia_doctor',
    name: 'دکتر مافیا',
    description: [
      'می‌تواند اعضای مافیا را نجات دهد',
      'فقط یک بار در کل بازی می‌تواند استفاده کند',
      'نمی‌تواند خودش را نجات دهد'
    ],
    team: 'mafia',
    color: colors.secondary,
    abilities: ['heal_mafia_once']
  },
  {
    id: 'spy',
    name: 'جاسوس',
    description: [
      'عضو مافیا که به عنوان شهروند ظاهر می‌شود',
      'اطلاعات شهروندان را به مافیا می‌رساند',
      'برای کارآگاه شهروند شناخته می‌شود'
    ],
    team: 'mafia',
    color: colors.secondary,
    abilities: ['appear_innocent', 'gather_info']
  },

  // Independent Roles (مستقل)
  {
    id: 'serial_killer',
    name: 'قاتل زنجیره‌ای',
    description: [
      'هر شب یک نفر را می‌کشد',
      'برای پیروزی باید تنها بازمانده باشد',
      'نه با مافیا همکاری می‌کند نه با شهر'
    ],
    team: 'independent',
    color: colors.accent,
    abilities: ['kill_nightly']
  },
  {
    id: 'joker',
    name: 'جوکر',
    description: [
      'برای پیروزی باید در رای‌گیری روز اعدام شود',
      'اگر در شب کشته شود، بازی را می‌بازد',
      'هدف: مشکوک رفتار کند تا اعدامش کنند'
    ],
    team: 'independent',
    color: colors.accent,
    abilities: ['win_if_lynched']
  },
  {
    id: 'cupid',
    name: 'کوپید',
    description: [
      'در شب اول دو نفر را عاشق هم می‌کند',
      'اگر یکی از عاشقان بمیرد، دیگری هم می‌میرد',
      'اگر عاشقان از تیم‌های مختلف باشند، کوپید برنده می‌شود'
    ],
    team: 'independent',
    color: colors.accent,
    abilities: ['create_lovers']
  },
  {
    id: 'witch',
    name: 'جادوگر',
    description: [
      'یک بار می‌تواند کسی را نجات دهد',
      'یک بار می‌تواند کسی را بکشد',
      'قدرت‌هایش را در شب‌های مختلف استفاده می‌کند'
    ],
    team: 'independent',
    color: colors.accent,
    abilities: ['heal_once', 'kill_once']
  }
];

export const finalCards: FinalCard[] = [
  {
    id: 'identity_reveal',
    name: 'افشای هویت',
    description: [
      'هویت واقعی شما برای همه آشکار می‌شود',
      'تمام بازیکنان نقش شما را می‌دانند',
      'ممکن است استراتژی بازی را تغییر دهد'
    ],
    audioPath: 'audio/identity_reveal.mp3'
  },
  {
    id: 'last_words',
    name: 'آخرین کلمات',
    description: [
      'قبل از مرگ می‌توانید ۳۰ ثانیه صحبت کنید',
      'می‌توانید اطلاعات مهم را فاش کنید',
      'آخرین فرصت برای تأثیرگذاری روی بازی'
    ],
    audioPath: 'audio/last_words.mp3'
  },
  {
    id: 'revenge',
    name: 'انتقام',
    description: [
      'می‌توانید یک نفر را با خود به کشتن دهید',
      'آن شخص باید از کسانی باشد که به شما رای داده',
      'انتقام شیرینی از دشمنان خود بگیرید'
    ],
    audioPath: 'audio/revenge.mp3'
  },
  {
    id: 'silence',
    name: 'سکوت',
    description: [
      'تا پایان بازی نمی‌توانید صحبت کنید',
      'فقط با اشاره و حرکت می‌توانید ارتباط برقرار کنید',
      'چالش بزرگی برای ادامه بازی'
    ],
    audioPath: 'audio/silence.mp3'
  },
  {
    id: 'double_vote',
    name: 'رای مضاعف',
    description: [
      'در رای‌گیری بعدی دو رای دارید',
      'می‌توانید نتیجه رای‌گیری را تغییر دهید',
      'قدرت تأثیرگذاری بالا روی بازی'
    ],
    audioPath: 'audio/double_vote.mp3'
  },
  {
    id: 'immunity',
    name: 'مصونیت',
    description: [
      'یک شب از حملات در امان هستید',
      'نمی‌توانید کشته شوید',
      'فرصت طلایی برای زنده ماندن'
    ],
    audioPath: 'audio/immunity.mp3'
  },
  {
    id: 'role_swap',
    name: 'تعویض نقش',
    description: [
      'نقش خود را با یک بازیکن دیگر عوض کنید',
      'هر دو نقش‌های جدید را می‌گیرید',
      'تغییر کامل در استراتژی بازی'
    ],
    audioPath: 'audio/role_swap.mp3'
  },
  {
    id: 'investigation',
    name: 'تحقیق',
    description: [
      'می‌توانید نقش یک بازیکن را بدانید',
      'اطلاعات مهمی کسب می‌کنید',
      'به شما در تصمیم‌گیری کمک می‌کند'
    ],
    audioPath: 'audio/investigation.mp3'
  },
  {
    id: 'protection',
    name: 'محافظت',
    description: [
      'می‌توانید یک بازیکن را محافظت کنید',
      'آن شخص یک شب در امان است',
      'نشان دهید که متحد او هستید'
    ],
    audioPath: 'audio/protection.mp3'
  },
  {
    id: 'chaos',
    name: 'هرج و مرج',
    description: [
      'تمام بازیکنان نقش‌هایشان را عوض می‌کنند',
      'بازی کاملاً تغییر می‌کند',
      'هیچ‌کس نمی‌داند چه اتفاقی می‌افتد'
    ],
    audioPath: 'audio/chaos.mp3'
  }
];

export const defaultGameSettings = {
  minPlayers: 3,
  maxPlayers: 12,
  speakingTimeIntro: 40, // seconds
  speakingTimeRegular: 120, // seconds
  challengeTime: 60, // seconds
  defenseTime: 120, // seconds
  safeMode: true,
  selectedRoles: [],
  selectedFinalCards: []
};
