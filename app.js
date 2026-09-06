const { useState, useMemo, useEffect, useRef } = React;

// --- أيقونات SVG ---
const IconShoppingBag = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const IconSparkles = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const IconMinus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
  </svg>
);

// --- مكون تكبير الصور (Pinch to Zoom & Touch Modal) ---
const ImageZoomModal = ({ src, alt, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const touchRef = useRef({ initialDist: 0, initialScale: 1, lastX: 0, lastY: 0, isDragging: false });

  const handleZoomIn = (e) => { e.stopPropagation(); setScale(prev => Math.min(prev + 0.5, 4)); };
  const handleZoomOut = (e) => { e.stopPropagation(); setScale(prev => { const next = Math.max(prev - 0.5, 1); if (next === 1) setPosition({ x: 0, y: 0 }); return next; }); };
  const handleReset = (e) => { e.stopPropagation(); setScale(1); setPosition({ x: 0, y: 0 }); };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      touchRef.current.initialDist = dist;
      touchRef.current.initialScale = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      touchRef.current.isDragging = true;
      touchRef.current.lastX = e.touches[0].clientX - position.x;
      touchRef.current.lastY = e.touches[0].clientY - position.y;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchRef.current.initialDist > 0) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const newScale = Math.min(Math.max((dist / touchRef.current.initialDist) * touchRef.current.initialScale, 1), 4);
      setScale(newScale);
    } else if (e.touches.length === 1 && touchRef.current.isDragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - touchRef.current.lastX,
        y: e.touches[0].clientY - touchRef.current.lastY
      });
    }
  };

  const handleTouchEnd = () => { touchRef.current.isDragging = false; touchRef.current.initialDist = 0; };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-2" onClick={onClose}>
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button onClick={handleZoomIn} className="bg-amber-600/80 text-white p-2 rounded-full font-bold text-xs">🔍+</button>
        <button onClick={handleZoomOut} className="bg-amber-600/80 text-white p-2 rounded-full font-bold text-xs">🔍-</button>
        <button onClick={handleReset} className="bg-gray-700/80 text-white p-2 rounded-full font-bold text-xs">🔄</button>
        <button onClick={onClose} className="bg-red-600/80 text-white p-2 px-3 rounded-full font-bold text-xs">✕</button>
      </div>
      <div 
        className="w-full h-full flex items-center justify-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={src} 
          alt={alt} 
          className="max-w-full max-h-full object-contain transition-transform duration-75 select-none"
          style={{ transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)` }}
        />
      </div>
    </div>
  );
};

// --- بيانات الحلويات والمنتجات (تم تصحيح اسم الصورة FB_IMG_1788530048619_600x800.jpg) ---
const PRODUCTS_DATA = [
  {
    id: 1,
    name: 'قريوش معسل ومورق بالجلجلان',
    category: 'traditional',
    price: 80,
    unit: 'حبة',
    image: 'images/Qraywish.jpg',
    description: 'قريوش تقليدي جزائري هش ومورق، معسل ومزين بالجلجلان المحمص.',
    minOrder: 30,
    ingredients: [
      { name: 'فرينة ممتازة', traditional: '3 كـيلات (بول)', metric: '450 غرام' },
      { name: 'سمن ذائب ومصفى', traditional: '1 كـيلة (بول)', metric: '150 غرام' },
      { name: 'عسل وشربات', traditional: 'حسب الرغبة', metric: '300 غرام' },
      { name: 'جلجلان محمص', traditional: 'للتزيين', metric: '50 غرام' }
    ]
  },
  {
    id: 2,
    name: 'ميني كيك شوكولاتة الشانتيه والكراميل',
    category: 'prestige',
    price: 150,
    unit: 'حبة',
    image: 'images/FB_IMG_1788052064065.jpg',
    description: 'حلوى برستيج عصرية بالشوكولاتة المزدوجة والكراميل مع تزيين إكسسوارات القلوب.',
    minOrder: 20,
    ingredients: [
      { name: 'شوكولاتة الحليب والبيضاء', traditional: 'حسب القالب', metric: '500 غرام' },
      { name: 'حشو الكراميل والجوز', traditional: 'كيلة جوز + كراميل', metric: '300 غرام' },
      { name: 'بسكويت هش', traditional: 'قاعدة الحلوى', metric: '200 غرام' }
    ]
  },
  {
    id: 3,
    name: 'غريبة الوردة',
    category: 'traditional',
    price: 110,
    unit: 'حبة',
    image: 'images/FB_IMG_1788036915154.jpg',
    description: 'تشاراك هش ومخبوز بعناية مع خطوط شوكولاتة بيضاء وتزيين بالفسدق والورد المجفف.',
    minOrder: 20,
    ingredients: [
      { name: 'فرينة', traditional: '3 كـيلات', metric: '400 غرام' },
      { name: 'سمن ذائب', traditional: '1 كـيلة', metric: '130 غرام' },
      { name: 'لوز مطحون للحشو', traditional: '2 كيلة لوز', metric: '200 غرام' },
      { name: 'فسدق وورد مجفف للتزيين', traditional: 'حسب الرغبة', metric: '50 غرام' }
    ]
  },
  {
    id: 4,
    name: 'حلوى الكرة البنفسجية الملكية (Violet Prestige)',
    category: 'prestige',
    price: 160,
    unit: 'حبة',
    image: 'images/FB_IMG_1788052015617.jpg',
    description: 'حلوى برستيج مغطاة بطلاء بنفسجي ملكي ناعم ومزينة بالورد المجفف ورقائق الذهب.',
    minOrder: 20,
    ingredients: [
      { name: 'عجينة الصابلي', traditional: 'قاعدة الحلوى', metric: '300 غرام' },
      { name: 'حشو اللوز والنيسلي', traditional: 'حشو مركز', metric: '350 غرام' },
      { name: 'طلاء الشوكولاتة الملونة', traditional: 'تغليف خارجي', metric: '400 غرام' }
    ]
  },
  {
    id: 5,
    name: 'غريبة الورقة',
    category: 'traditional',
    price: 140,
    unit: 'حبة',
    image: 'images/FB_IMG_1788036883036.jpg',
    description: 'دزيريات تقليدية معسلة ومقروضة بعناية، محشوة باللوز ومزينة برشة فسدق وورد.',
    minOrder: 25,
    ingredients: [
      { name: 'فرينة العجينة', traditional: '3 كـيلات', metric: '300 غرام' },
      { name: 'حشو اللوز والليمون', traditional: '3 كـيلات لوز', metric: '500 غرام' },
      { name: 'عسل طبيعي', traditional: 'للتعسيل', metric: '500 غرام' }
    ]
  },
  {
    id: 6,
    name: 'تشاراك المسكر الناعم',
    category: 'traditional',
    price: 100,
    unit: 'حبة',
    image: 'images/FB_IMG_1788051956400.jpg',
    description: 'تشاراك مسكر أبيض يذوب في الفم، محشو بعقدة اللوز المعطرة بماء الزهر.',
    minOrder: 25,
    ingredients: [
      { name: 'فرينة ممتازة', traditional: '3 كـيلات', metric: '450 غرام' },
      { name: 'سمن ذائب', traditional: '1 كيلة', metric: '150 غرام' },
      { name: 'عقدة اللوز', traditional: '3 كـيلات لوز', metric: '300 غرام' },
      { name: 'سكر ناعم للتسكير', traditional: 'حسب الحاجة', metric: '500 غرام' }
    ]
  },
  {
    id: 7,
    name: 'البراج (المبرجة الجزائرية)',
    category: 'traditional',
    price: 60,
    unit: 'حبة',
    image: 'images/FB_IMG_1788052314156.jpg',
    description: 'مبرجة تقليدية هشّة تذوب في الفم محشوة بالغرس (معجون التمر) المعطر.',
    minOrder: 30,
    ingredients: [
      { name: 'سميد متوسط', traditional: '3 كـيلات', metric: '600 غرام' },
      { name: 'سمن ذائب أو مارغرين', traditional: '1 كـيلة', metric: '200 غرام' },
      { name: 'غرس (معجون تمر)', traditional: 'حسب الحشو', metric: '400 غرام' },
      { name: 'ماء وماء زهر', traditional: 'للجمع', metric: '150 مل' }
    ]
  },
  {
    id: 8,
    name: 'علب تحلية الشوكولاتة والكراميل الطبقات',
    category: 'prestige',
    price: 250,
    unit: 'علبة',
    image: 'images/FB_IMG_1788052024215.jpg',
    description: 'تحلية راقية في علب فردية مكونة من طبقات الكيك، الكريمة، والشوكولاتة الغنية.',
    minOrder: 10,
    ingredients: [
      { name: 'بسكويت شوكولاتة أو كيك', traditional: 'قاعدة التحلية', metric: '300 غرام' },
      { name: 'كريمة الشانتيه والفانيليا', traditional: 'طبقة كريمة', metric: '400 غرام' },
      { name: 'جناش الشوكولاتة والكراميل', traditional: 'الطبقة العلوية', metric: '250 غرام' }
    ]
  },
  {
    id: 9,
    name: 'صابلي المبروك بالشوكولاتة والكراميل',
    category: 'prestige',
    price: 130,
    unit: 'حبة',
    image: 'images/FB_IMG_1788052089445.jpg',
    description: 'صابلي برستيج مطبوع بعبارة "ألف مبروك" محشو بالكراميل ومغلف بالشوكولاتة.',
    minOrder: 20,
    ingredients: [
      { name: 'عجينة صابلي طرية', traditional: 'قاعدة', metric: '400 غرام' },
      { name: 'توفيا كراميل وحشو', traditional: 'حشو داخلي', metric: '250 غرام' },
      { name: 'شوكولاتة الحليب للتغليف', traditional: 'تغليف', metric: '350 غرام' }
    ]
  },
  {
    id: 10,
    name: 'صابلي البرستيج بالفستق الأخضر',
    category: 'prestige',
    price: 140,
    unit: 'حبة',
    image: 'images/FB_IMG_1788052053571.jpg',
    description: 'حلوى برستيج بالشوكولاتة ومزينة بلمسة الفستق الحلبي الأخضر البراق.',
    minOrder: 20,
    ingredients: [
      { name: 'صابلي شوكولاتة', traditional: 'قاعدة', metric: '350 غرام' },
      { name: 'كريمة المكسرات', traditional: 'حشو', metric: '200 غرام' },
      { name: 'فستق حلبي مطحون', traditional: 'تزيين', metric: '80 غرام' }
    ]
  },
  {
    id: 11,
    name: 'حلوى الجوزة واللوز بالطلاء الأبيض',
    category: 'prestige',
    price: 150,
    unit: 'حبة',
    image: 'images/FB_IMG_1788052255683.jpg',
    description: 'حلوى برستيج ملكية مغطاة بالشوكولاتة البيضاء ومزينة بحبة جوز كاملة.',
    minOrder: 20,
    ingredients: [
      { name: 'عقدة اللوز والمكسرات', traditional: 'حشو داخلي', metric: '400 غرام' },
      { name: 'شوكولاتة بيضاء للتغليف', traditional: 'تغليف', metric: '300 غرام' },
      { name: 'أنصاف الجوز', traditional: 'تزيين علوي', metric: '100 غرام' }
    ]
  },
  {
    id: 12,
    name: 'قلوب الشوكولاتة والقطايف المحمصة',
    category: 'prestige',
    price: 145,
    unit: 'حبة',
    image: 'images/FB_IMG_1788052199750.jpg',
    description: 'قلوب الصابلي المحشوة والمغطاة بالشوكولاتة مع القطايف المحمصة ولمسة الذهب.',
    minOrder: 20,
    ingredients: [
      { name: 'عجينة صابلي القلوب', traditional: 'قاعدة', metric: '350 غرام' },
      { name: 'قطايف محمرة بالزبك', traditional: 'تزيين وحشو', metric: '150 غرام' },
      { name: 'شوكولاتة ورائحة اللوز', traditional: 'تغليف وتزيين', metric: '300 غرام' }
    ]
  },
  {
    id: 13,
    name: 'مقروض التمر المربع التقليدي (علبة كاملة)',
    category: 'traditional',
    price: 70,
    unit: 'حبة',
    image: 'images/FB_IMG_1788530018886_600x800.jpg',
    description: 'مقروض التمر التقليدي المنقوش بحبة القرنفل المخبوز بعناية والذائب في الفم.',
    minOrder: 25,
    ingredients: [
      { name: 'سميد متوسط', traditional: '3 كـيلات', metric: '600 غرام' },
      { name: 'سمن ذائب ومصفى', traditional: '1 كـيلة', metric: '200 غرام' },
      { name: 'غرس معجون بالقرفة', traditional: 'حشو داخلي', metric: '400 غرام' }
    ]
  },
  {
    id: 14,
    name: 'ميني كيك قلوب الشوكولاتة والكراميل و جوز الهند',
    category: 'prestige',
    price: 140,
    unit: 'حبة',
    image: 'images/FB_IMG_1788530048619_600x800.jpg', // تم تصحيح المسار بنجاح
    description: 'حلوى برستيج بشكل قلوب الشوكولاتة المخططة بالخطوط البيضاء والمغطاة ببرش جوز الهند الناعم.',
    minOrder: 20,
    ingredients: [
      { name: 'شوكولاتة سوداء وبيضاء', traditional: 'تغليف', metric: '400 غرام' },
      { name: 'جوز الهند المحمص', traditional: 'قاعدة ورش', metric: '200 غرام' },
      { name: 'كريمة الكراميل', traditional: 'حشو', metric: '250 غرام' }
    ]
  },
  {
    id: 15,
    name: 'بقلاوة اللوز والجوز الملكية',
    category: 'traditional',
    price: 180,
    unit: 'حبة',
    image: 'images/FB_IMG_1788530108555.jpg',
    description: 'بقلاوة تقليدية جزائرية مورقة بالطبقات الغنية بالمكسرات المعسلة والمزينة بحبة البندق.',
    minOrder: 20,
    ingredients: [
      { name: 'فرينة التوريق', traditional: 'عجينة الطبقات', metric: '500 غرام' },
      { name: 'لوز وجوز مفروم', traditional: '3 كـيلات حشو', metric: '700 غرام' },
      { name: 'سمن طبيعي وعسل حر', traditional: 'للتعسيل والتوريق', metric: '600 غرام' }
    ]
  },
  {
    id: 16,
    name: 'صابلي النجاح والمناسبات "مبروك النجاح"',
    category: 'prestige',
    price: 155,
    unit: 'حبة',
    image: 'images/converted_image (1).jpeg',
    description: 'صابلي برستيج بيضاوي مغلف بالشوكولاتة ومزين بعبارات النجاح الذهبية والأزهار المجففة.',
    minOrder: 20,
    ingredients: [
      { name: 'عجينة صابلي الزبدة', traditional: 'قاعدة الحلوى', metric: '400 غرام' },
      { name: 'حشو التوفيا والمكسرات', traditional: 'حشو داخلي', metric: '300 غرام' },
      { name: 'شوكولاتة الحليب وتزيين ذهبي', traditional: 'تغليف ديكور', metric: '350 غرام' }
    ]
  },
  {
    id: 17,
    name: 'أصابع الفريرو روشيه بالفيوتين والمكسرات',
    category: 'prestige',
    price: 165,
    unit: 'حبة',
    image: 'images/converted_image.jpeg',
    description: 'أصابع حلوى برستيج مقرمشة بغلاف الشوكولاتة والمكسرات المحمصة على طراز الفريرو روشيه.',
    minOrder: 20,
    ingredients: [
      { name: 'بسكويت وفيوتين مقرمش', traditional: 'حشو مقرمش', metric: '300 غرام' },
      { name: 'شوكولاتة فريرو بالمكسرات', traditional: 'تغليف خارجي', metric: '400 غرام' },
      { name: 'زبدة الفول السوداني أو البندق', traditional: 'عقدة الحشو', metric: '200 غرام' }
    ]
  },
  {
    id: 18,
    name: 'مقروض القلوب والأشكال العصرية بالوزن',
    category: 'traditional',
    price: 900,
    unit: 'كغ',
    image: 'images/FB_IMG_1788530185959.jpg',
    description: 'مقروض التمر المليء بالتمر المفروم والمشكل بأشكال قلوب وأهلة، ميزان دقيق وطعم رائع.',
    minOrder: 1,
    ingredients: [
      { name: 'سميد ممتاز', traditional: '3 كـيلات', metric: '1000 غرام' },
      { name: 'سمن طبيعي', traditional: '1 كـيلة', metric: '350 غرام' },
      { name: 'معجون الغرس المعطر', traditional: 'حشو', metric: '600 غرام' }
    ]
  }
];

// --- بيانات الوصفات المكتوبة ---
const recipesData = [
  {
    id: 1,
    title: "قريوش تقليدي",
    category: "حلويات مقلية",
    image: "images/Qraywish.jpg",
    prepTime: "45 دقيقة",
    description: "قريوش جزائري تقليدي هش ومقرمش، معسل ومعطر بماء الزهر والتزيين بالسمسم.",
    ingredients: ["500غ فرينة", "125غ مارغرين ذائبة", "حبة بيض", "ملعقة صغيرة خميرة كيميائية", "رشة ملح وماء زهر للجمع", "عسل وسمسم للتزيين"],
    steps: ["خلط الفرينة مع المارغرين ورشة الملح جيداً.", "إضافة البيضة والخميرة ثم جمع العجينة بماء الزهر.", "فرد العجينة وتشكيليها.", "قلي القريوش في زيت ساخن.", "تعسيله وتزيينه بالسمسم."]
  },
  {
    id: 2,
    title: "مقروض الكوشة",
    category: "حلويات معسلة",
    image: "images/FB_IMG_1788530018886_600x800.jpg",
    prepTime: "60 دقيقة",
    description: "مقروض التمر التقليدي المخبوز في الفرن، يتميز بطعمه الغني بالسمن وماء الزهر.",
    ingredients: ["3 كيلات سميد متوسط", "كيلة سمن ذائب ومبرد", "خليط ماء وماء زهر", "حشو التمر (الغرس) معجون بالقرفة والقرنفل"],
    steps: ["بسّ السميد بالسمن جيداً وتركه يرتاح.", "رش الخليط بماء الزهر وتشكيل مقروضات محشوة بالتمر.", "خبز المقروض في الفرن ثم تعسيله."]
  },
  {
    id: 3,
    title: "البراج (المبرجة الجزائرية)",
    category: "حلويات تقليدية",
    image: "images/FB_IMG_1788052314156.jpg",
    prepTime: "40 دقيقة",
    description: "وصفة البراج الجزائرية التقليدية الهشة بالمبرجة والتمر المعجون.",
    ingredients: ["3 كيلات سميد متوسط", "1 كيلة سمن ذائب أو مارغرين", "رشة ملح وماء دافئ مع ماء زهر", "غرس معجون بقليل من السمن والقرفة"],
    steps: ["خلط السميد مع الملح والسمن وتبيسيسه.", "جمع العجين بالماء وماء الزهر.", "بسط العجينة وتغطيتها بالغرس ثم بالطبقة الثانية.", "تقطيعه وطهيه على طاجين ناعم."]
  },
  {
    id: 4,
    title: "علب تحلية الكاكاو والكراميل",
    category: "تحليات عصرية",
    image: "images/FB_IMG_1788052024215.jpg",
    prepTime: "30 دقيقة",
    description: "تحلية العلب الفردية المكونة من كيك الشوكولاتة والشانتيه والجناش.",
    ingredients: ["بسكويت شوكولاتة مرحي", "200غ بودرة الشانتيه مخفوقة", "200غ شوكولاتة ذائبة", "صلصة كراميل للتزيين"],
    steps: ["وضع طبقة البسكويت في العلب.", "إضافة طبقة من الشانتيه.", "سكب الجناش كطبقة أخيرة والتبريد."]
  }
];

function MainApp() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  const [eventGuestCount, setEventGuestCount] = useState(200);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [eventDetails, setEventDetails] = useState({
    customerName: '',
    city: 'عنابة',
    date: '',
    notes: ''
  });

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter(p => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch = p.name.includes(searchQuery) || p.description.includes(searchQuery);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + product.minOrder } : item));
    } else {
      setCart([...cart, { ...product, quantity: product.minOrder }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const calculatedIngredients = useMemo(() => {
    const factor = eventGuestCount / 100;
    return {
      almondKg: (factor * 2.5).toFixed(1),
      flourKg: (factor * 3.0).toFixed(1),
      smenKg: (factor * 1.2).toFixed(1),
      honeyKg: (factor * 2.0).toFixed(1),
      approxCostDzd: (eventGuestCount * 110).toLocaleString()
    };
  }, [eventGuestCount]);

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    if (!navigator.onLine) {
      alert("⚠️ تعذر إرسال الطلب!\nأنت غير متصل بالإنترنت حالياً. يرجى الاتصال بالشبكة لإرسال الطلبية عبر الواتساب.");
      return;
    }

    let message = `*طلب جديد من فرح للحلويات الجزائرية* 🍰\n\n`;
    if (eventDetails.customerName) message += `*الزبون:* ${eventDetails.customerName}\n`;
    message += `*الولاية:* ${eventDetails.city}\n`;
    message += `*تاريخ المناسبة:* ${eventDetails.date || 'غير محدد'}\n\n`;
    message += `*تفاصيل العلب والحلويات:*\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n   • الكمية: ${item.quantity} ${item.unit}\n   • السعر: ${(item.price * item.quantity).toLocaleString()} د.ج\n`;
    });

    message += `\n*الإجمالي التقديري:* ${totalCartPrice.toLocaleString()} د.ج\n`;
    if (eventDetails.notes) message += `*ملاحظات التزيين/التغليف:* ${eventDetails.notes}\n`;
    message += `\nيرجى تأكيد الحجز وتنسيق قيمة العربون. شكراً لكم!`;

    const url = `https://wa.me/213675909258?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      {/* Zoom Modal عند الضغط على أي صورة */}
      {zoomedImage && (
        <ImageZoomModal 
          src={zoomedImage.src} 
          alt={zoomedImage.alt} 
          onClose={() => setZoomedImage(null)} 
        />
      )}

      {/* شريط حالة الاتصال العلوي */}
      <div className={`text-center py-1 text-xs font-bold transition-all ${isOnline ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
        {isOnline ? '🟢 أنت متصل بالإنترنت (وضع أونلاين)' : '🟠 تعمل حالياً بوضع الأوفلاين (سيتم حظر الواتساب حتى الاتصال)'}
      </div>

      {/* الشريط العلوي */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <img 
              src="images/logo.jpg" 
              alt="فرح للحلويات" 
              onClick={(e) => { e.stopPropagation(); setZoomedImage({ src: 'images/logo.jpg', alt: 'شعار فرح للحلويات' }); }}
              className="w-11 h-11 rounded-full object-cover border-2 border-amber-500 shadow-sm cursor-zoom-in"
            />
            <div>
              <h1 className="font-extrabold text-lg text-amber-950 leading-tight">فرح للحلويات الجزائرية</h1>
              <p className="text-xs text-amber-700 font-semibold">أصالة التراث وفخامة البرستيج</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('cart')}
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all relative"
            >
              <IconShoppingBag />
              <span className="hidden sm:inline">سلة الطلبيات</span>
              {totalItemsCount > 0 && (
                <span className="bg-amber-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* الهيرو */}
      <section className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white py-10 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs px-3.5 py-1 rounded-full mb-3">
            <IconSparkles /> طلبات الأعراس والحفلات مفتوحة الآن
          </span>
          <h2 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
            حلويات جزائرية تقليدية وعصرية بلمسة احترافية
          </h2>
          <p className="text-amber-100/80 text-xs sm:text-sm max-w-xl mx-auto mb-5">
            نستخدم أفضل المكونات الطبيعية (لوز صافي، سمن طبيعي، عسل حر) مع التوصيل والتغليف الخاص بالمناسبات.
          </p>
        </div>
      </section>

      {/* شريط التنقل */}
      <div className="max-w-6xl mx-auto px-4 mt-6 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-2 rounded-2xl shadow-xs border border-amber-100 mb-6 text-center text-xs font-bold">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-2.5 rounded-xl transition-all ${
              activeTab === 'catalog' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:bg-amber-50'
            }`}
          >
            🎂 الكتالوج والمتجر
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`py-2.5 rounded-xl transition-all ${
              activeTab === 'recipes' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:bg-amber-50'
            }`}
          >
            📖 كتاب الوصفات
          </button>
          <button
            onClick={() => setActiveTab('eventCalc')}
            className={`py-2.5 rounded-xl transition-all ${
              activeTab === 'eventCalc' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:bg-amber-50'
            }`}
          >
            👰 حاسبة الأعراس
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`py-2.5 rounded-xl transition-all relative ${
              activeTab === 'cart' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:bg-amber-50'
            }`}
          >
            🛒 سلة الحجز ({totalItemsCount})
          </button>
        </div>
      </div>

      {/* الكتالوج */}
      {activeTab === 'catalog' && (
        <main className="max-w-6xl mx-auto px-4 pb-16 w-full flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="w-full sm:w-72 relative">
              <input
                type="text"
                placeholder="ابحث عن نوع الحلوى..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 shadow-xs"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === 'all' ? 'bg-amber-950 text-amber-100' : 'bg-white border border-amber-100 text-gray-700'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setActiveCategory('traditional')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === 'traditional' ? 'bg-amber-950 text-amber-100' : 'bg-white border border-amber-100 text-gray-700'
                }`}
              >
                تقليدي أصيل 🏺
              </button>
              <button
                onClick={() => setActiveCategory('prestige')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === 'prestige' ? 'bg-amber-950 text-amber-100' : 'bg-white border border-amber-100 text-gray-700'
                }`}
              >
                برستيج عصري ✨
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="relative h-48 overflow-hidden cursor-zoom-in" onClick={() => setZoomedImage({ src: product.image, alt: product.name })}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 bg-amber-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      أقل طلب: {product.minOrder} {product.unit}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-extrabold text-gray-900 text-base mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-xs mb-3 leading-relaxed line-clamp-2">{product.description}</p>
                    
                    <div className="flex justify-between items-center bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                      <span className="text-xs text-amber-900 font-bold">السعر:</span>
                      <span className="text-amber-900 font-black text-lg">{product.price} د.ج <span className="text-xs font-normal text-gray-500">/ {product.unit}</span></span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => setSelectedProductModal(product)}
                    className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold py-2 rounded-xl text-xs transition-all"
                  >
                    📏 المكونات
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow-xs"
                  >
                    <IconPlus /> إضافة للسلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* كتاب الوصفات */}
      {activeTab === 'recipes' && (
        <main className="max-w-6xl mx-auto px-4 pb-16 w-full flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipesData.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-amber-100 flex flex-col">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  onClick={() => setZoomedImage({ src: item.image, alt: item.title })}
                  className="w-full h-48 object-cover cursor-zoom-in" 
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs bg-[#3b1200]/10 text-[#3b1200] px-2 py-1 rounded-full font-bold">{item.category}</span>
                    <h2 className="text-lg font-bold mt-2 text-[#3b1200]">{item.title}</h2>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-amber-100 pt-3">
                    <span className="text-xs text-gray-500 font-semibold">⏱️ {item.prepTime}</span>
                    <button 
                      onClick={() => setSelectedRecipe(item)}
                      className="bg-[#3b1200] text-white text-sm px-4 py-1.5 rounded-lg font-medium hover:bg-opacity-90 transition-all">
                      عرض الوصفة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal تفاصيل الوصفة */}
          {selectedRecipe && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
              <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto p-5 border border-amber-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#3b1200]">{selectedRecipe.title}</h3>
                  <button onClick={() => setSelectedRecipe(null)} className="text-gray-500 text-2xl font-bold">&times;</button>
                </div>
                
                <img 
                  src={selectedRecipe.image} 
                  alt={selectedRecipe.title} 
                  onClick={() => setZoomedImage({ src: selectedRecipe.image, alt: selectedRecipe.title })}
                  className="w-full h-48 object-cover rounded-xl mb-4 cursor-zoom-in" 
                />
                
                <div className="mb-4">
                  <h4 className="font-bold text-sm mb-2 text-[#3b1200]">المكونات:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {selectedRecipe.ingredients.map((ing, index) => (
                      <li key={index}>{ing}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-2 text-[#3b1200]">طريقة التحضير:</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                    {selectedRecipe.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* حاسبة الأعراس */}
      {activeTab === 'eventCalc' && (
        <main className="max-w-xl mx-auto px-4 pb-16 w-full flex-grow">
          <div className="bg-white p-6 rounded-3xl border border-amber-100/80 shadow-xs mb-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-black text-amber-950 mb-2 flex items-center justify-center gap-2">
                حاسبة طلبيات الأعراس والحفلات 📋
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                أدخل عدد الحبات المطلوبة في حفلكم الميمون لحساب الكميات الكلية للمواد الأولية والتكلفة التقديرية.
              </p>
            </div>

            <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-100/60 mb-6">
              <div className="text-center font-extrabold text-amber-950 text-sm mb-4">
                عدد الحبات الإجمالي المطلوب: ({eventGuestCount} حبة)
              </div>
              <input 
                type="range" 
                min="50" 
                max="1500" 
                step="50" 
                value={eventGuestCount} 
                onChange={(e) => setEventGuestCount(Number(e.target.value))}
                className="w-full accent-amber-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-3"
              />
              <div className="flex justify-between text-[11px] font-bold text-gray-500 px-1">
                <span>50 حبة</span>
                <span>500 حبة</span>
                <span>1000 حبة</span>
                <span>1500 حبة</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center mb-6">
              <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-2xs">
                <span className="block text-xs font-bold text-gray-500 mb-1">اللوز الصافي المقشر</span>
                <span className="block text-amber-950 font-black text-2xl">{calculatedIngredients.almondKg} كغ</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-2xs">
                <span className="block text-xs font-bold text-gray-500 mb-1">الفرينة الممتازة</span>
                <span className="block text-amber-950 font-black text-2xl">{calculatedIngredients.flourKg} كغ</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-2xs">
                <span className="block text-xs font-bold text-gray-500 mb-1">السمن الطبيعي</span>
                <span className="block text-amber-950 font-black text-2xl">{calculatedIngredients.smenKg} كغ</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-2xs">
                <span className="block text-xs font-bold text-gray-500 mb-1">العسل والشربات</span>
                <span className="block text-amber-950 font-black text-2xl">{calculatedIngredients.honeyKg} كغ</span>
              </div>
            </div>

            <div className="bg-[#3b1200] text-white p-6 rounded-2xl text-center shadow-md">
              <span className="text-xs font-bold block text-amber-200/80 mb-2">التكلفة التقديرية الإجمالية للحلويات:</span>
              <span className="text-3xl font-black text-amber-400 block mb-2">{calculatedIngredients.approxCostDzd} د.ج</span>
              <span className="text-[10px] text-amber-200/60 block">* السعر يتغير بحسب نوع التزيين والطلاء المختار.</span>
            </div>
          </div>
        </main>
      )}

      {/* سلة الطلبيات */}
      {activeTab === 'cart' && (
        <main className="max-w-3xl mx-auto px-4 pb-16 w-full flex-grow">
          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs">
            <h3 className="text-lg font-extrabold text-amber-950 mb-4">🛒 تفاصيل الحجز والطلب</h3>

            {cart.length === 0 ? (
              <p className="text-center text-xs text-gray-500 py-8">السلة فارغة حالياً. اضف بعض الحلويات من الكتالوج لتقديم الطلب.</p>
            ) : (
              <div>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-amber-50/40 p-3 rounded-xl border border-amber-100">
                      <div>
                        <h4 className="font-bold text-xs text-gray-800">{item.name}</h4>
                        <span className="text-[11px] text-amber-900 font-semibold">{(item.price * item.quantity).toLocaleString()} د.ج</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -5)} className="bg-white border p-1 rounded-lg text-xs"><IconMinus /></button>
                        <span className="text-xs font-bold px-2">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 5)} className="bg-white border p-1 rounded-lg text-xs"><IconPlus /></button>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs font-bold mr-2">إزالة</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-black text-amber-950 text-base mb-4">
                    <span>المبلغ الإجمالي التقديري:</span>
                    <span>{totalCartPrice.toLocaleString()} د.ج</span>
                  </div>

                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="اسم الزبون" 
                      value={eventDetails.customerName}
                      onChange={(e) => setEventDetails({...eventDetails, customerName: e.target.value})}
                      className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-xs font-semibold"
                    />
                    <input 
                      type="text" 
                      placeholder="الولاية (مثلاً: عنابة)" 
                      value={eventDetails.city}
                      onChange={(e) => setEventDetails({...eventDetails, city: e.target.value})}
                      className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-xs font-semibold"
                    />
                    <textarea 
                      placeholder="ملاحظات إضافية للتزيين أو التغليف..." 
                      value={eventDetails.notes}
                      onChange={(e) => setEventDetails({...eventDetails, notes: e.target.value})}
                      className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-xs font-semibold h-20"
                    />
                  </div>
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  📲 تأكيد وإرسال الطلب عبر الواتساب
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* نافذة المكونات Modal للمتجر */}
      {selectedProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-amber-100">
            <h3 className="font-extrabold text-base text-amber-950 mb-2">{selectedProductModal.name}</h3>
            <p className="text-xs text-gray-500 mb-4">مقادير الوصفة المعتمدة:</p>
            <ul className="space-y-2 mb-6">
              {selectedProductModal.ingredients.map((ing, idx) => (
                <li key={idx} className="flex justify-between text-xs bg-amber-50 p-2 rounded-lg">
                  <span className="font-bold text-gray-800">{ing.name}</span>
                  <span className="text-amber-900 font-semibold">{ing.metric}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setSelectedProductModal(null)}
              className="w-full bg-amber-950 text-white font-bold py-2 rounded-xl text-xs"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* التذييل */}
      <footer className="bg-amber-950 text-amber-200/80 text-center py-4 text-xs">
        <p>جميع الحقوق محفوظة © فرح للحلويات الجزائرية</p>
      </footer>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MainApp />);
