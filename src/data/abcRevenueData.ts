// Dados originais do dashboard ABC (com anos ajustados: 2024 -> 2025, 2025 -> 2026)

export interface AccountRow {
  c: string
  n: string
  a: number // 2025
  b: number // 2026
}

export interface ClientRow {
  n: string
  ch: string
  t: number
  by: Record<string, number>
}

export const ABC_DATA = {
  P: [
    'Skincare',
    'Maquiagem',
    'Perfumaria',
    'Cabelos',
    'Corpo e Kits',
    'Royalties e Serviços',
  ] as const,

  accts: [
    { c: '4.1.1.01.01.001', n: 'Venda Atacado – Distribuidores', a: 36.2, b: 40.8 },
    { c: '4.1.1.01.01.002', n: 'Venda Varejo – Lojas Próprias', a: 14.5, b: 15.6 },
    { c: '4.1.1.01.01.003', n: 'Venda Franquias', a: 9.8, b: 12.7 },
    { c: '4.1.1.01.02.001', n: 'Venda E-commerce Próprio', a: 29.401151, b: 14.9 },
    { c: '4.1.1.01.02.002', n: 'Venda Marketplaces', a: 0, b: 23.445235 },
    { c: '4.1.1.02.01.001', n: 'Royalties e Serviços', a: 4.2, b: 5.1 },
  ] as AccountRow[],

  gt: [
    // 2025 (anteriormente 2024)
    [27.86935681, 22.025781995, 17.530724445, 12.58616114, 9.88912661, 4.2],
    // 2026 (anteriormente 2025)
    [35.24203708, 24.604958815, 20.41459465, 16.76145666, 10.422187795, 5.1],
  ],

  mp: {
    Skincare: [
      2.50722168, 2.33853887, 2.62338052, 2.85575256, 3.45784076, 2.95975805, 2.74567086,
      2.89258049, 3.02359019, 3.09809123, 3.99084502, 2.74876685,
    ],
    Maquiagem: [
      1.57926306, 1.47389675, 1.65339393, 2.05352663, 2.47750878, 2.12732451, 1.97961558,
      2.08691274, 2.18197775, 2.22566517, 2.81377954, 1.95209439,
    ],
    Perfumaria: [
      1.48259845, 1.38528111, 1.55028397, 1.6830607, 2.0671869, 1.74288519, 1.60180765, 1.69584849,
      1.76360327, 1.8059536, 2.10885413, 1.52723119,
    ],
    Cabelos: [
      1.08648438, 1.01325317, 1.13735866, 1.38460608, 1.66516473, 1.43630275, 1.33811299,
      1.40855121, 1.47398879, 1.50572755, 1.96491747, 1.34698889,
    ],
    'Corpo e Kits': [
      0.74243244, 0.69253011, 0.77558292, 0.84457754, 1.02550086, 0.87747917, 0.81081641,
      0.85485675, 0.89131586, 0.91503829, 1.17138908, 0.82066836,
    ],
    'Royalties e Serviços': [
      0.425, 0.425, 0.425, 0.425, 0.425, 0.425, 0.425, 0.425, 0.425, 0.425, 0.425, 0.425,
    ],
  } as Record<string, number[]>,

  mch: {
    'Venda Atacado – Distribuidores': [
      3.264, 3.06, 3.468, 3.468, 4.284, 3.468, 3.264, 3.468, 3.672, 3.672, 3.468, 2.244,
    ],
    'Venda Varejo – Lojas Próprias': [
      1.17, 1.092, 1.17, 1.248, 1.56, 1.326, 1.17, 1.248, 1.248, 1.326, 1.56, 1.482,
    ],
    'Venda Franquias': [
      0.9525, 0.889, 1.016, 1.016, 1.3335, 1.143, 0.9525, 1.016, 1.016, 1.0795, 1.27, 1.016,
    ],
    'Venda E-commerce Próprio': [
      2.0115, 1.8625, 2.086, 0.745, 0.8195, 0.745, 0.745, 0.745, 0.8195, 0.894, 2.235, 1.192,
    ],
    'Venda Marketplaces': [
      0.0, 0.0, 0.0, 2.3445235, 2.696202025, 2.461749675, 2.3445235, 2.461749675, 2.57897585,
      2.57897585, 3.51678525, 2.461749675,
    ],
    'Royalties e Serviços': [
      0.425, 0.425, 0.425, 0.425, 0.425, 0.425, 0.425, 0.425, 0.425, 0.425, 0.425, 0.425,
    ],
  } as Record<string, number[]>,

  clients: [
    {
      n: 'Marketplace Ágora',
      ch: 'Venda Marketplaces',
      t: 12.1,
      by: {
        Skincare: 3.80135243,
        Maquiagem: 3.44609012,
        Perfumaria: 1.31994549,
        Cabelos: 2.47159914,
        'Corpo e Kits': 1.06101281,
      },
    },
    {
      n: 'Distribuidora Nativa Beauty',
      ch: 'Venda Atacado – Distribuidores',
      t: 8.9,
      by: {
        Skincare: 2.83060163,
        Maquiagem: 2.00473641,
        Perfumaria: 2.04764834,
        Cabelos: 1.22695149,
        'Corpo e Kits': 0.79006213,
      },
    },
    {
      n: 'Mercado Lumi',
      ch: 'Venda Marketplaces',
      t: 7.3,
      by: {
        Skincare: 2.29337791,
        Maquiagem: 2.07904611,
        Perfumaria: 0.79633075,
        Cabelos: 1.49113006,
        'Corpo e Kits': 0.64011517,
      },
    },
    {
      n: 'Beleza Brasil Atacado',
      ch: 'Venda Atacado – Distribuidores',
      t: 6.8,
      by: {
        Skincare: 2.16270686,
        Maquiagem: 1.53170872,
        Perfumaria: 1.56449536,
        Cabelos: 0.93744608,
        'Corpo e Kits': 0.60364298,
      },
    },
    {
      n: 'Perfumarias Estrela do Sul',
      ch: 'Venda Atacado – Distribuidores',
      t: 5.4,
      by: {
        Skincare: 1.71744368,
        Maquiagem: 1.21635692,
        Perfumaria: 1.24239338,
        Cabelos: 0.74444248,
        'Corpo e Kits': 0.47936354,
      },
    },
    {
      n: 'Rede Bella Vita',
      ch: 'Venda Franquias',
      t: 4.9,
      by: {
        Skincare: 1.69586868,
        Maquiagem: 0.96086137,
        Perfumaria: 0.98142887,
        Cabelos: 0.72395285,
        'Corpo e Kits': 0.53788823,
      },
    },
    {
      n: 'Grupo Vitória Varejo',
      ch: 'Venda Atacado – Distribuidores',
      t: 4.3,
      by: {
        Skincare: 1.36759404,
        Maquiagem: 0.96858051,
        Perfumaria: 0.98931324,
        Cabelos: 0.59279679,
        'Corpo e Kits': 0.38171541,
      },
    },
    {
      n: 'Drogarias Aurora',
      ch: 'Venda Atacado – Distribuidores',
      t: 3.9,
      by: {
        Skincare: 1.24037599,
        Maquiagem: 0.87848,
        Perfumaria: 0.89728411,
        Cabelos: 0.5376529,
        'Corpo e Kits': 0.346207,
      },
    },
    {
      n: 'Magnólia Franquias',
      ch: 'Venda Franquias',
      t: 3.4,
      by: {
        Skincare: 1.17672521,
        Maquiagem: 0.66672013,
        Perfumaria: 0.68099146,
        Cabelos: 0.50233463,
        'Corpo e Kits': 0.37322857,
      },
    },
    {
      n: 'Farma Viva',
      ch: 'Venda Atacado – Distribuidores',
      t: 3.0,
      by: {
        Skincare: 0.95413538,
        Maquiagem: 0.67575385,
        Perfumaria: 0.69021854,
        Cabelos: 0.41357915,
        'Corpo e Kits': 0.26631308,
      },
    },
    {
      n: 'Casa Orquídea',
      ch: 'Venda Franquias',
      t: 2.2,
      by: {
        Skincare: 0.76141043,
        Maquiagem: 0.43140714,
        Perfumaria: 0.44064153,
        Cabelos: 0.32504006,
        'Corpo e Kits': 0.24150084,
      },
    },
  ] as ClientRow[],

  // [2025, 2026]
  rol: [94.10115144, 112.54523547],
}

// DRE Consolidado: [2025, 2026]
export const DRE_VALUES = {
  rol: ABC_DATA.rol,
  cmv: [24.596, 26.251],
  lb: [69.505, 86.294],
  ll: [11.978, 16.069],
}

export const MONTHS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]
