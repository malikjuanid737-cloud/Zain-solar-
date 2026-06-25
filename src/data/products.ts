import { Product } from '../types';

export const HERO_BANNER_IMAGE = '/src/assets/images/solar_hero_banner_1782319654771.jpg';
export const PANEL_IMAGE = '/src/assets/images/solar_panel_thumbnail_1782319677362.jpg';
export const BATTERY_IMAGE = '/src/assets/images/solar_battery_thumbnail_1782319696617.jpg';
export const INVERTER_IMAGE = '/src/assets/images/solar_inverter_thumbnail_1782319717612.jpg';

export const CATEGORIES = [
  'Solar Panels',
  'Solar Batteries',
  'Solar Inverters',
  'Solar Accessories',
  'Solar Complete Kits'
];

export const PRODUCTS: Product[] = [
  {
    id: 'js-panel-550w',
    name: 'Zain Solar Max 550W Mono-PERC Panel',
    price: 32000,
    discountPrice: 28500,
    sku: 'JS-PL-550W',
    stockStatus: 'In Stock',
    stockQuantity: 124,
    category: 'Solar Panels',
    description: 'High-efficiency monocrystalline solar panel designed to deliver maximum power generation even in low light and cloudy weather conditions. Comes with a durable aluminum frame and a long-lasting performance warranty.',
    specifications: {
      'Max Power (Pmax)': '550 Watts',
      'Efficiency': '21.3%',
      'Cell Type': 'Monocrystalline PERC',
      'Dimensions': '2279 x 1134 x 35 mm',
      'Weight': '28.6 kg',
      'Warranty': '25 Years Performance, 12 Years Product',
      'Open Circuit Voltage (Voc)': '49.8V'
    },
    images: [
      PANEL_IMAGE,
      'https://picsum.photos/seed/solarpanel2/600/600',
      'https://picsum.photos/seed/solarpanel3/600/600'
    ],
    rating: 4.8,
    reviews: [
      {
        id: 'r1',
        userName: 'Zia-ur-Rehman',
        rating: 5,
        comment: 'Excellent solar panels! The performance is outstanding even during the intense summer heat. Zain Solar is truly a trustworthy brand.',
        date: '2026-05-12'
      },
      {
        id: 'r2',
        userName: 'Kamran Shah',
        rating: 4,
        comment: 'The build quality of these panels is very durable and voltages are perfectly stable. Delivered right on time.',
        date: '2026-06-01'
      }
    ]
  },
  {
    id: 'js-battery-10kwh',
    name: 'Zain Solar Li-Ultra 10kWh Lithium Battery',
    price: 380000,
    discountPrice: 345000,
    sku: 'JS-BT-10KWH',
    stockStatus: 'In Stock',
    stockQuantity: 45,
    category: 'Solar Batteries',
    description: 'Cutting-edge Lithium Iron Phosphate (LiFePO4) solar battery providing more than 6,000 charge cycles. Highly durable, fast-charging, and provides exceptional long-term power backup.',
    specifications: {
      'Capacity': '10 kWh (200Ah, 48V)',
      'Battery Type': 'Lithium Iron Phosphate (LiFePO4)',
      'Life Cycles': '6000+ @ 80% DoD',
      'Dimensions': '650 x 480 x 220 mm',
      'Weight': '82 kg',
      'Warranty': '10 Years Replacement Warranty',
      'Max Charge Current': '100A'
    },
    images: [
      BATTERY_IMAGE,
      'https://picsum.photos/seed/solarbattery2/600/600'
    ],
    rating: 4.9,
    reviews: [
      {
        id: 'r3',
        userName: 'Muhammad Usman',
        rating: 5,
        comment: 'Compared to old lead-acid batteries, this lithium battery works like magic. Load shedding is no longer an issue.',
        date: '2026-04-20'
      }
    ]
  },
  {
    id: 'js-inverter-10kw',
    name: 'Zain Solar Smart Hybrid 10kW Inverter',
    price: 240000,
    discountPrice: 215000,
    sku: 'JS-INV-10KW',
    stockStatus: 'In Stock',
    stockQuantity: 38,
    category: 'Solar Inverters',
    description: 'Three-phase smart hybrid inverter equipped with net metering capability. Featuring an LCD display and Wi-Fi support for convenient remote energy production tracking right from your phone.',
    specifications: {
      'Rated Power': '10,000 Watts (10kW)',
      'Inverter Type': 'Smart Hybrid (On-Grid / Off-Grid)',
      'MPPT Trackers': '2 Dual MPPT Channel',
      'Max PV Input': '13,000W',
      'Grid Support': 'Net Metering Ready (Export Approved)',
      'Warranty': '5 Years Standard Warranty',
      'Efficiency': '97.6%'
    },
    images: [
      INVERTER_IMAGE,
      'https://picsum.photos/seed/solarinv2/600/600'
    ],
    rating: 4.7,
    reviews: [
      {
        id: 'r4',
        userName: 'Hamza Malik',
        rating: 5,
        comment: 'Outstanding hybrid inverter. Net metering performance is fast and reliable, and the Wi-Fi monitoring works flawlessly.',
        date: '2026-05-18'
      }
    ]
  },
  {
    id: 'js-kit-5kw',
    name: 'Zain Solar 5kW Smart Home Complete Kit',
    price: 750000,
    discountPrice: 680000,
    sku: 'JS-KIT-5KW',
    stockStatus: 'Low Stock',
    stockQuantity: 12,
    category: 'Solar Complete Kits',
    description: 'Complete solar power solution for small and medium-sized homes. Includes panels, hybrid inverter, lithium battery, pure copper cables, heavy-duty mounting stands, and complete professional installation.',
    specifications: {
      'System Capacity': '5 kW Generation',
      'Solar Panels Included': '9 x Zain Solar 550W Panels',
      'Inverter Included': '1 x Zain Solar Smart 5kW Hybrid Inverter',
      'Storage Included': '1 x Zain Solar Li-Ultra 5kWh Battery',
      'Daily Production': '20 - 25 Units (kWh) Average',
      'Appliances Load Supported': '1.5 Ton AC, Fridge, Water Pump, Fans & Lights',
      'Installation': 'Standard Nationwide Installation Included'
    },
    images: [
      'https://picsum.photos/seed/solarkit5kw/600/600',
      PANEL_IMAGE,
      INVERTER_IMAGE
    ],
    rating: 4.9,
    reviews: [
      {
        id: 'r5',
        userName: 'Ayesha Bibi',
        rating: 5,
        comment: 'We installed this kit and our electricity bill is virtually zero now. Their team worked very professionally and cleanly. Thanks, Zain Solar!',
        date: '2026-03-10'
      }
    ]
  },
  {
    id: 'js-kit-10kw',
    name: 'Zain Solar 10kW Premium Villa Complete Kit',
    price: 1350000,
    discountPrice: 1250000,
    sku: 'JS-KIT-10KW',
    stockStatus: 'In Stock',
    stockQuantity: 15,
    category: 'Solar Complete Kits',
    description: 'Ultimate solar power package designed for large villas and offices. Includes a high-capacity battery, net metering approval support, and a complete 10kW three-phase smart hybrid system.',
    specifications: {
      'System Capacity': '10 kW Generation',
      'Solar Panels Included': '18 x Zain Solar 550W Panels',
      'Inverter Included': '1 x Zain Solar Smart 10kW Hybrid Inverter',
      'Storage Included': '1 x Zain Solar Li-Ultra 10kWh Battery',
      'Daily Production': '40 - 50 Units (kWh) Average',
      'Appliances Load Supported': '2 x 1.5 Ton AC, Inverter Fridge, Water Pump, Multiple Fans & LCDs',
      'Installation': 'Premium Nationwide Turnkey Setup with Net-Metering Filing'
    },
    images: [
      'https://picsum.photos/seed/solarkit10kw/600/600',
      PANEL_IMAGE,
      BATTERY_IMAGE,
      INVERTER_IMAGE
    ],
    rating: 5.0,
    reviews: [
      {
        id: 'r6',
        userName: 'Sohail Ahmad',
        rating: 5,
        comment: "Great investment! After net metering setup, the grid pays us back during winter. Zain Solar's customer support is top-notch.",
        date: '2026-02-15'
      }
    ]
  },
  {
    id: 'js-acc-cable',
    name: 'Zain Solar PV DC Cables Copper 100m Roll',
    price: 28000,
    discountPrice: 24500,
    sku: 'JS-AC-PV4',
    stockStatus: 'In Stock',
    stockQuantity: 80,
    category: 'Solar Accessories',
    description: 'Pure copper core with double insulation solar DC cable designed to withstand extreme sunlight, heat, and rain. Perfect for connecting solar panels to inverters with low voltage loss.',
    specifications: {
      'Cable Type': 'PV1-F DC Solar Cable',
      'Conductor Material': 'Tinned Copper (99.99%)',
      'Size': '6mm²',
      'Length': '100 Meters Roll',
      'Voltage Rating': '1.5kV DC',
      'Temperature Range': '-40°C to +90°C'
    },
    images: [
      'https://picsum.photos/seed/solarcable/600/600'
    ],
    rating: 4.5,
    reviews: [
      {
        id: 'r7',
        userName: 'Faisal Khan',
        rating: 4,
        comment: 'Very high-quality cable. The copper conductor and insulation quality are outstanding.',
        date: '2026-05-05'
      }
    ]
  },
  {
    id: 'js-acc-stand',
    name: 'Zain Solar Galvanized Heavy Mounting Stand (3 Panels)',
    price: 15000,
    discountPrice: 13500,
    sku: 'JS-AC-GISTAND',
    stockStatus: 'In Stock',
    stockQuantity: 95,
    category: 'Solar Accessories',
    description: 'Robust solar panel stand made from hot-dip galvanized iron (GI), built to easily withstand high winds and seismic activity. Includes angle adjustment options.',
    specifications: {
      'Material': 'Hot-Dip Galvanized Iron (Rust-Free)',
      'Capacity': 'Holds 3 Solar Panels (450W - 650W)',
      'Wind Load Capacity': 'Up to 150 km/h',
      'Angle Adjustment': '15° to 35° Degrees',
      'Weight': '18 kg'
    },
    images: [
      'https://picsum.photos/seed/solarstand/600/600'
    ],
    rating: 4.6,
    reviews: []
  },
  {
    id: 'js-acc-wifi',
    name: 'Zain Solar Smart WiFi Remote Monitoring Dongle',
    price: 9500,
    discountPrice: 8000,
    sku: 'JS-AC-WIFI',
    stockStatus: 'Low Stock',
    stockQuantity: 8,
    category: 'Solar Accessories',
    description: 'Simply plug into your inverter\'s USB port and connect to the internet. Monitor your solar system generation and usage in real-time from anywhere in the world via our mobile app.',
    specifications: {
      'Interface': 'USB Plug & Play',
      'WiFi Support': '802.11 b/g/n (2.4 GHz)',
      'App Support': 'Android & iOS App Remote Monitoring',
      'Data Logging Interval': '5 Minutes',
      'Power Source': 'Powered directly by inverter USB port'
    },
    images: [
      'https://picsum.photos/seed/solarwifi/600/600'
    ],
    rating: 4.4,
    reviews: [
      {
        id: 'r8',
        userName: 'Javed Iqbal',
        rating: 5,
        comment: 'Very useful device. I can check my home solar performance from my office desk. The companion app is highly informative.',
        date: '2026-04-12'
      }
    ]
  }
];

export const FAQS = [
  {
    q: 'What is the average lifespan of a solar panel?',
    a: 'Modern solar panels (such as Zain Solar Max) have an average lifespan of 25 to 30 years and come with a 25-year performance warranty.'
  },
  {
    q: 'What is Net Metering and what are its benefits?',
    a: 'Through net metering, you can export excess solar electricity generated during the day back to the national grid. This not only reduces your bill to zero but can also earn you solar credits.'
  },
  {
    q: 'Which battery is better: Lithium or Lead-Acid (Tubular)?',
    a: 'Lithium batteries (LiFePO4) are superior in every aspect. They have a lifespan that is 5 times longer than lead-acid batteries, charge much faster, and require zero maintenance.'
  },
  {
    q: 'Are installation and mounting services included with complete kits?',
    a: 'Yes, all Zain Solar home kits include nationwide professional mounting and turnkey installation services free of charge.'
  }
];

export const COUPONS = [
  { code: 'ZAINSOLAR10', discount: 0.10, description: 'Get 10% OFF on all panels and accessories!' },
  { code: 'CLEANENERGY', discount: 15000, isFlat: true, description: 'Flat PKR 15,000 discount on complete kits!' }
];
