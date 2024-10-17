export const productData = [
  [
    { type: "Canvas", size: "30x30 2cm", price: 35.9 },
    { type: "Canvas", size: "30x30 4cm", price: 46.9 },
    { type: "Canvas", size: "50x50 2cm", price: 59.9 },
    { type: "Canvas", size: "50x50 4cm", price: 69.9 },
    { type: "Canvas", size: "70x70 2cm", price: 69.9 },
    { type: "Canvas", size: "70x70 4cm", price: 89.9 },
    { type: "Canvas", size: "100x100 2cm", price: 119.9 },
    { type: "Canvas", size: "100x100 4cm", price: 159.9 },
    { type: "Canvas", size: "140x140 2cm", price: 189.9 },
    { type: "Canvas", size: "140x140 4cm", price: 247.9 },
    { type: "Canvas", size: "30x20 2cm", price: 29.9 },
    { type: "Canvas", size: "30x20 4cm", price: 39.9 },
    { type: "Canvas", size: "60x40 2cm", price: 49.9 },
    { type: "Canvas", size: "60x40 4cm", price: 65.9 },
    { type: "Canvas", size: "90x60 2cm", price: 65.9 },
    { type: "Canvas", size: "90x60 4cm", price: 85.9 },
    { type: "Canvas", size: "120x80 2cm", price: 95.9 },
    { type: "Canvas", size: "120x80 4cm", price: 125.9 },
    { type: "Canvas", size: "180x120 2cm", price: 229.9 },
    { type: "Canvas", size: "180x120 4cm", price: 299.9 },
  ],

  [
    { type: "Aluminium", size: "30x30", price: 39.9 },
    { type: "Aluminium", size: "50x50", price: 69.9 },
    { type: "Aluminium", size: "70x70", price: 139.9 },
    { type: "Aluminium", size: "100x100", price: 199.9 },
    { type: "Aluminium", size: "120x120", price: 249.9 },
    { type: "Aluminium", size: "30x20", price: 36.9 },
    { type: "Aluminium", size: "60x40", price: 69.9 },
    { type: "Aluminium", size: "90x60", price: 99.9 },
    { type: "Aluminium", size: "120x80", price: 189.9 },
    { type: "Aluminium", size: "180x120", price: 349.9 },
  ],

  [
    { type: "Plexiglas", size: "30x30", price: 39.9 },
    { type: "Plexiglas", size: "50x50", price: 69.9 },
    { type: "Plexiglas", size: "70x70", price: 139.9 },
    { type: "Plexiglas", size: "100x100", price: 225.9 },
    { type: "Plexiglas", size: "120x120", price: 319.9 },
    { type: "Plexiglas", size: "30x20", price: 36.9 },
    { type: "Plexiglas", size: "60x40", price: 69.9 },
    { type: "Plexiglas", size: "90x60", price: 189.9 },
    { type: "Plexiglas", size: "120x80", price: 229.9 },
    { type: "Plexiglas", size: "180x120", price: 479.9 },
  ],
];

export const generateVariation = () => {
  const data = [
    {
      id: 1,
      name: "Material",
      options: [
        { title: "Metal", price: 0.2 },
        { title: "Canvas", price: 0.4 },
        { title: "Glass", price: 0.4 },
      ],
    },
    {
      id: 2,
      name: "Size",
      options: [
        { title: "10  cm x 10  cm", price: 0.4 },
        { title: "20  cm x 20  cm", price: 0.2 },
      ],
    },
  ];
  let variations = [];

  for (let material of data[0].options) {
    for (let size of data[1].options) {
      let variation = {
        attributes: [
          { id: data[0].id, option: material.title },
          { id: data[1].id, option: size.title },
        ],
        regular_price: (3 + material.price + size.price).toString(),
      };
      variations.push(variation);
    }
  }
  return variations;
};
