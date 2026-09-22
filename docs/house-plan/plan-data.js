/* Loewen House Plan — base data. Units: FEET, global coordinates.
   x = 0 at the garage's west outer wall, y = 0 at the house front (north).
   The house proper starts at x = G (14.83). Everything drawn on the plan
   comes from this file; the artifact database holds edits on top of it. */
window.PLAN = (function () {
  const G = 14.83;            // house west wall
  const SB = 8.0;             // garage front, set back from the house front (Jeff: "8 feet" to the garage door)
  const HW = 39.42;           // house width
  const ED = 29.25;           // east side depth (SE corner)
  const KJ = 5.58;            // kitchen bump-out
  const KB = 7.7;             // width of the bump-out (Jeff: 22'6" from the SW corner = garage 14.83 + 7.7)
  const H = hx => G + hx;

  const outline = [
    [0, SB], [G, SB], [G, 0], [H(19.67), 0], [H(19.67), 3.67], [H(25.17), 3.67], [H(25.17), 0],
    [H(35.17), 0], [H(35.17), 3.5], [H(HW), 3.5], [H(HW), ED], [H(KB), ED], [H(KB), ED + KJ], [0, ED + KJ]
  ];

  // rooms: rect [x,y,w,h] or poly [[x,y],...]; kind drives the tint
  const rooms = [
    { id: 'garage', name: 'GARAGE', sub: '13 × 24 · taped', rect: [0.8, SB + 0.8, 13, ED + KJ - 0.83 - (SB + 0.8)], kind: 'garage' },
    { id: 'master', name: 'MASTER BEDROOM', sub: '15 × 11', rect: [H(0), 0, 19.67, 11], kind: 'bed', label: [H(14.5), 7.8] },
    { id: 'foyer', name: 'FOYER', sub: '8 × 6', rect: [H(19.67), 3.67, 5.5, 7.33], kind: 'hall' },
    { id: 'porch', name: 'PORCH', sub: "5'6\" × 3'8\"", rect: [H(19.67), 0, 5.5, 3.67], kind: 'porch' },
    { id: 'guest', name: 'GUEST BEDROOM', sub: '11 × 10', rect: [H(25.17), 0, 10, 11], kind: 'bed', label: [H(30.2), 9.3] },
    { id: 'gbath', name: 'GUEST BATH', sub: '', rect: [H(35.17), 3.5, 4.25, 7.5], kind: 'bath', label: [H(37.3), 7.0] },
    { id: 'wc', name: 'WC', sub: '', rect: [H(0), 11, 3, 3], kind: 'bath', small: true },
    { id: 'mclo1', name: 'CLOSET', sub: '', rect: [H(0), 14, 3, 5], kind: 'clo', small: true },
    { id: 'mbath', name: 'MASTER BATH', sub: '8 × 8', rect: [H(3), 11, 8, 8], kind: 'bath', label: [H(7.2), 13.4] },
    { id: 'mclo2', name: 'CLOSET', sub: '', rect: [H(11), 11, 4, 8], kind: 'clo', small: true },
    { id: 'dryer', name: 'DRYER', sub: '', rect: [H(0), 19, 3.5, 3], kind: 'util', small: true },
    { id: 'pantry', name: 'PANTRY', sub: '', rect: [H(3.5), 19, 3.5, 3], kind: 'util', small: true },
    { id: 'washer', name: 'WASHER', sub: '', rect: [H(7), 19, 4.42, 3], kind: 'util', small: true },
    { id: 'linen', name: 'LINEN', sub: '', rect: [H(11.42), 19, 3.58, 3], kind: 'clo', small: true },
    { id: 'kitchen', name: 'KITCHEN · DINING', sub: '16 × 13', kind: 'kitchen',
      poly: [[H(0), 22], [H(16), 22], [H(16), ED], [H(KB), ED], [H(KB), ED + KJ], [H(0), ED + KJ]], label: [H(6.8), 25.4] },
    { id: 'hall', name: 'HALLWAY', sub: 'open to the living room', rect: [H(15), 11, 14.42, 4], kind: 'hall', label: [H(19.6), 12.05] },
    { id: 'vest', name: 'vestibule', sub: '', rect: [H(29.42), 11, 5.75, 4], kind: 'hall', small: true },
    { id: 'vclo', name: '', sub: '', rect: [H(29.42), 13.5, 1.6, 1.5], kind: 'clo', small: true },
    { id: 'eclo', name: 'CLOSET', sub: '', rect: [H(35.17), 11, 4.25, 4], kind: 'clo', small: true },
    { id: 'living', name: 'LIVING ROOM', sub: '14 × 17', rect: [H(15), 15, 14.42, 14.25], kind: 'living', label: [H(20.2), 22.6] },
    { id: 'office', name: 'OFFICE · BED 3', sub: '10 × 13', rect: [H(29.42), 15, 10, 14.25], kind: 'bed', label: [H(35.4), 17.8] },
    { id: 'fp', name: 'FP', sub: '', rect: [H(29.42), 16, 1.5, 5], kind: 'clo', small: true },
    { id: 'fclo', name: '', sub: '', rect: [H(29.42), 22, 1.5, 7.25], kind: 'clo', small: true },
  ];

  const dashedWalls = [
    { seg: [H(15), 15, H(29.42), 15], label: 'open' },
    { seg: [H(16), 22, H(16), ED], label: 'half wall' },
  ];

  // doors: hinge point, swing end, sweep flag (SVG arc), plus the wall gap
  const doors = [
    { id: 'front', a: [H(20.3), 3.67], b: [H(22.5), 3.67], r: 2.2, sweep: 1, gap: [H(19.9), 3.67, H(25.0), 3.67], label: 'FRONT DOOR' },
    { id: 'gbed', a: [H(33), 11], b: [H(35.17), 11], r: 2.2, sweep: 0, gap: [H(33.1), 11, H(35.1), 11] },
    { id: 'office', a: [H(31.2), 15], b: [H(33.4), 15], r: 2.2, sweep: 1, gap: [H(31.3), 15, H(33.3), 15] },
    { id: 'gbath', a: [H(35.17), 11], b: [H(37.4), 11], r: 2.2, sweep: 1, gap: [H(35.3), 11, H(37.3), 11] },
    { id: 'eclo', a: [H(35.17), 13], b: [H(35.17), 15], r: 2.0, sweep: 0, gap: [H(35.17), 13.1, H(35.17), 14.9] },
    { id: 'master', a: [H(19.67), 8.6], b: [H(19.67), 11], r: 2.4, sweep: 1, gap: [H(19.67), 8.7, H(19.67), 10.9] },
    { id: 'garage-house', a: [H(0), 22], b: [H(0), 24.4], r: 2.4, sweep: 0, gap: [H(0), 22.1, H(0), 24.3] },
    { id: 'deck', a: [H(19), ED], b: [H(21.4), ED], r: 2.4, sweep: 0, gap: [H(19.1), ED, H(21.3), ED], label: 'deck door' },
    { id: 'mbath', a: [H(11), 12.2], b: [H(11), 14.4], r: 2.2, sweep: 1, gap: [H(11), 12.3, H(11), 14.3] },
    { id: 'man', a: [0.8, 18], b: [0.8, 20.4], r: 2.4, sweep: 1, gap: [0.8, 18.1, 0.8, 20.3], label: 'man door' },
  ];
  // wide openings drawn as slider / overhead door
  const bigDoors = [
    { id: 'garage-door', seg: [2.8, SB, 11.8, SB], kind: 'overhead', label: 'GARAGE DOOR' },
    { id: 'kitchen-deck', seg: [H(11), ED, H(14), ED], kind: 'slider', label: 'deck door' },
  ];

  const windows = [
    { seg: [H(5.7), 0, H(8.3), 0], label: 'arched window' },
    { seg: [H(31.7), 0, H(34.3), 0], label: 'window' },
    { seg: [H(1.8), ED + KJ, H(4.4), ED + KJ], label: 'kitchen window' },
    { seg: [H(23.2), ED, H(25.8), ED], label: 'window' },
    { seg: [H(26.2), ED, H(28.8), ED], label: 'window' },
    { seg: [H(33.2), ED, H(35.8), ED], label: 'window' },
  ];

  // fixtures: light line art that anchors devices
  const fixtures = [
    { kind: 'bed', rect: [H(0.5), 3.0, 6.5, 5.0], head: 'w', label: 'bed' },
    { kind: 'rect', rect: [H(13.2), 0.3, 6.2, 2.6], label: 'network shelf' },
    { kind: 'tv', rect: [H(18.9), 3.4, 0.6, 4.4], label: 'TV' },
    { kind: 'bed', rect: [H(27.5), 0.5, 4.8, 6.5], head: 'n', label: 'bed' },
    { kind: 'tub', rect: [H(35.4), 3.7, 3.8, 2.4] },
    { kind: 'toilet', at: [H(36.1), 9.3] },
    { kind: 'sink', at: [H(38.6), 8.5] },
    { kind: 'toilet', at: [H(1.5), 12.4] },
    { kind: 'sink', at: [H(5.0), 11.7] }, { kind: 'sink', at: [H(9.0), 11.7] },
    { kind: 'tub', rect: [H(3.2), 16.5, 7.6, 2.3], label: 'tub / shower' },
    { kind: 'appliance', rect: [H(0.5), 19.4, 2.5, 2.3] }, { kind: 'appliance', rect: [H(7.6), 19.4, 3.2, 2.3] },
    { kind: 'appliance', rect: [H(0.2), 25.3, 2.8, 3.0], label: 'fridge' },
    { kind: 'appliance', rect: [H(0.2), 29.0, 2.5, 2.6], label: 'range' },
    { kind: 'sink', at: [H(2.7), 34.2] },
    { kind: 'rect', rect: [H(4.4), 29.6, 2.0, 4.6], label: 'bar', vertical: true },
    { kind: 'table', rect: [H(11.3), 23.2, 3.8, 3.6], label: 'dining' },
    { kind: 'tv', rect: [H(28.6), 17.4, 0.6, 4.2], label: 'TV' },
    { kind: 'rect', rect: [H(36.6), 19.5, 2.6, 7.5], label: 'desk' },
    { kind: 'rect', rect: [0.9, 30.1, 3.6, 3.5], label: 'bench' },
    { kind: 'wh', at: [11.7, 31.7] },
    { kind: 'grille', rect: [H(23.4), 11.1, 2.2, 0.9], label: 'return 20×25' },
  ];

  // things outside the walls
  const yard = [
    { kind: 'box', rect: [H(40.2), 11.2, 4.0, 4.0], label: 'A/C PACKAGE UNIT', sub: '2.5 ton · on pad', color: '#5b6b7a' },
    { kind: 'box', rect: [H(40.2), 23.4, 3.2, 2.2], label: 'B-HYVE', sub: 'timer', color: '#1a9c7a' },
    { kind: 'box', rect: [H(40.2), 26.4, 3.2, 2.2], label: 'VALVE BOX', sub: 'irrigation', color: '#1a9c7a' },
    { kind: 'deck', poly: [[H(16.5), ED], [H(36), ED], [H(36), 38.5], [H(16.5), 38.5]], label: 'BACK DECK', sub: 'elevated · steps at the west end' },
    { kind: 'firepit', at: [H(20), 41.0], r: 1.6, label: 'fire pit' },
    { kind: 'mast', rect: [H(36.3), 33.2, 6.6, 3.4], label: 'ROOF MAST', sub: 'weather-station mast on the roof · drawn here for space' },
    { kind: 'crawl', seg: [H(35.6), ED, H(37.4), ED], label: 'crawl space door' },
    { kind: 'drive', poly: [[0.6, 0], [14.2, 0], [14.2, SB], [0.6, SB]], label: 'DRIVEWAY' },
    { kind: 'walk', poly: [[H(19.67), -0.2], [H(25.17), -0.2], [H(25.17), -2.6], [H(19.67), -2.6]], label: 'steps up' },
  ];

  const cats = [
    { id: 'NET', name: 'Network & Power', color: '#1d5fbf' },
    { id: 'CAM', name: 'Cameras', color: '#b3261e' },
    { id: 'LIT', name: 'Lighting', color: '#b8860b' },
    { id: 'PLG', name: 'Plugs & Lamps', color: '#e06d10' },
    { id: 'CON', name: 'Door & Window Contacts', color: '#2e8b57' },
    { id: 'LEA', name: 'Leak Sensors', color: '#0f8ea3' },
    { id: 'ZIG', name: 'Zigbee Mesh & Siren', color: '#6b3fa0' },
    { id: 'HVA', name: 'HVAC', color: '#5b6b7a' },
    { id: 'IRR', name: 'Irrigation', color: '#1a9c7a' },
    { id: 'MED', name: 'Media & Voice', color: '#c2185b' },
    { id: 'APP', name: 'Appliances', color: '#8d6e63' },
    { id: 'OTH', name: 'Other', color: '#455a64' },
  ];

  // devices: n, name, cat, x, y, [note]. Positions are Jeff's 22 Sep 2026 hand markup.
  const D = (n, name, cat, x, y, note) => ({ n, name, cat, x, y, note: note || '' });
  const devices = [
    D(1, 'AT&T gateway BGW320', 'NET', H(16.3), 0.9),
    D(2, 'The Beast (301Server)', 'NET', H(16.3), 2.2, 'CodeProject.AI host · Jeff’s PC'),
    D(3, 'Beehive (Home Assistant, Beelink J45)', 'NET', H(17.5), 0.9),
    D(4, 'Network switch', 'NET', H(17.5), 2.2),
    D(5, 'APC BN600 UPS', 'NET', H(18.7), 0.9),
    D(6, 'TP-Link RE200 (wired access point)', 'NET', H(18.7), 2.2),
    D(7, 'Garage PC', 'NET', 1.9, 32.6),
    D(8, 'Zigbee coordinator + antenna', 'NET', H(14.2), 1.3),
    D(9, 'Bluetooth dongle', 'NET', 2.0, 30.9),
    D(10, 'Front doorbell camera', 'CAM', H(20.4), 3.0),
    D(11, 'Driveway camera', 'CAM', 0.4, 7.4),
    D(12, 'Front right camera', 'CAM', H(40.2), 2.6),
    D(13, 'Back left camera', 'CAM', H(38.0), 35.0, 'on the roof mast'),
    D(14, 'Backyard camera', 'CAM', H(20), 41.0, 'at the fire pit'),
    D(15, 'Garage camera (mains Mini)', 'CAM', 6.8, 33.0),
    D(16, 'Bedroom cans · HS220 dimmer', 'LIT', H(9.0), 5.6),
    D(17, 'Kitchen / dining cans · HS220 dimmer', 'LIT', H(6.0), 27.4),
    D(18, 'Living room cans · HS220 dimmer', 'LIT', H(22.0), 20.2),
    D(19, 'Master bath cans · HS210', 'LIT', H(7.0), 14.6),
    D(20, 'Garage light · YM2108T', 'LIT', 4.5, 20.5),
    D(21, 'Jeff’s bed lamp', 'PLG', H(1.4), 1.5),
    D(22, 'Angela’s bed lamp', 'PLG', H(1.4), 9.5),
    D(23, 'Garage fan plug', 'PLG', 1.6, 15.0),
    D(24, 'Hot water pump', 'PLG', 11.8, 33.3, 'at the water heater'),
    D(25, 'Front door contact', 'CON', H(22.4), 4.5),
    D(26, 'Back deck door contact', 'CON', H(20.2), 28.4),
    D(27, 'Garage man door contact', 'CON', 1.5, 19.2),
    D(28, 'Garage door down contact', 'CON', 7.3, 9.7),
    D(29, 'Mailbox contact', 'CON', 14.0, -2.6),
    D(30, 'Spare contact 1', 'CON', H(26.0), 4.2),
    D(31, 'Guest bath leak sensor', 'LEA', H(38.4), 10.4),
    D(32, 'Kitchen sink leak sensor', 'LEA', H(1.6), 33.6),
    D(33, 'Kitchen refrigerator leak sensor', 'LEA', H(2.4), 24.6),
    D(34, 'Garage repeater plug', 'ZIG', 13.2, 21.6),
    D(35, 'Floating repeater plug', 'ZIG', H(36.6), 16.0),
    D(36, '301 alarm siren', 'ZIG', H(26.6), 11.9),
    D(37, 'A/C package unit', 'HVA', H(42.2), 13.2),
    D(38, 'Return grille 20 × 25', 'HVA', H(24.5), 11.9),
    D(39, 'Thermostat (ecobee, planned)', 'HVA', H(24.5), 13.4),
    D(40, 'A/C relay · SONOFF MINI-D', 'HVA', H(26.6), 13.4),
    D(41, 'Garage opener · SONOFF MINI-D', 'HVA', 7.6, 18.4),
    D(42, 'B-hyve timer', 'IRR', H(41.8), 24.5),
    D(43, 'Zone 1 · front right', 'IRR', H(7.5), -2.6),
    D(44, 'Zone 2 · front left', 'IRR', H(33.5), -2.6),
    D(45, 'Zone 3 · back left', 'IRR', H(30.0), 39.6),
    D(46, 'Zone 4 · back right', 'IRR', 7.5, 38.2),
    D(47, 'Zone 5 · right side drive', 'IRR', 2.6, 3.4),
    D(48, 'Garden zone', 'IRR', H(43.6), 38.0),
    D(49, 'Living room TV', 'MED', H(28.0), 18.9),
    D(50, 'Fire TV Stick 4K Max', 'MED', H(28.0), 20.5),
    D(51, 'Apple TV', 'MED', H(18.3), 5.7),
    D(52, 'Master bedroom TV', 'MED', H(18.3), 4.3),
    D(53, 'Garage TV', 'MED', H(26.0), 1.4, 'placed in the guest bedroom on the markup'),
    D(54, 'Living room Echo Dot', 'MED', H(16.4), 20.6),
    D(55, 'Master bedroom Echo', 'MED', H(1.4), 5.5),
    D(56, 'Vizio sound bar', 'MED', H(18.3), 7.1),
    D(57, 'Washer', 'APP', H(9.2), 20.5),
    D(58, 'Dryer', 'APP', H(1.75), 20.5),
    D(59, 'Stove / range', 'APP', H(1.3), 30.3),
    D(60, 'Refrigerator', 'APP', H(1.6), 26.8),
    D(61, 'Dishwasher', 'APP', H(3.8), 32.0),
    D(62, 'Sharky dock', 'OTH', H(10.3), 28.5),
    D(63, 'Electrical panel', 'OTH', 1.6, 12.9),
    D(64, 'Water meter', 'OTH', H(43.0), -3.2),
    D(65, 'Gas meter', 'OTH', H(40.4), 6.6),
    D(66, 'Electric meter', 'OTH', -0.9, 11.6),
    D(67, 'Weather station', 'OTH', H(39.6), 35.0, 'on the roof mast'),
    D(68, 'Antenna', 'NET', H(41.2), 35.0, 'on the roof mast'),
    D(69, 'RE200 (second)', 'NET', H(37.3), 22.8),
    D(70, 'Ethernet jack', 'NET', H(26.0), 2.8),
    D(71, 'Ethernet jack / network switch', 'NET', H(36.2), 24.9),
    D(72, 'Garage door keypad', 'OTH', 12.6, 7.3),
    D(73, 'Garage door push button', 'OTH', 13.2, 20.1),
    D(74, 'Garage Bluetooth speaker', 'MED', 3.5, 32.6),
    D(75, 'Irrigation valve box', 'IRR', H(41.8), 27.5),
    D(76, 'Irrigation shut-off (crawl space, right of the door)', 'IRR', H(38.0), 30.7),
    D(77, 'East-end house lights GFCI (crawl space)', 'OTH', H(39.4), 30.7),
    D(78, 'Deck TV + Roku', 'MED', H(27.5), 30.9),
  ];

  // recessed can lights, grouped to their dimmer
  const cans = {
    16: [[2.6, 2.8], [6.9, 2.8], [11.2, 2.8], [15.5, 2.8], [2.6, 8.2], [6.9, 8.2], [11.2, 8.2], [15.5, 8.2]].map(([a, b]) => [H(a), b]),
    17: [[2.6, 24.4], [6.6, 24.4], [10.6, 24.4], [14.4, 24.4], [2.6, 27.6], [6.6, 27.6], [10.6, 27.6], [14.4, 27.6], [2.6, 31.5], [6.0, 31.5]].map(([a, b]) => [H(a), b]),
    18: [[17.6, 17.4], [22.2, 17.4], [26.8, 17.4], [17.6, 22.2], [26.8, 22.2], [17.6, 27.0], [22.2, 27.0], [26.8, 27.0]].map(([a, b]) => [H(a), b]),
    19: [[4.6, 12.4], [9.4, 12.4], [4.6, 17.6], [9.4, 17.6]].map(([a, b]) => [H(a), b]),
  };

  /* Ductwork — the Rev D scope (21 Sep 2026), laid on the plan.
     Trunk and return run in the crawl space under the hallway line.
     Register positions are drawn to the room, NOT measured: drag them in edit mode
     and the run lengths recompute. */
  const duct = {
    unit: { x: H(40.2), y: 11.2, w: 4.0, h: 4.0 },
    supplyY: 13.6,
    returnY: 15.6,
    trunk: [
      { from: H(HW), to: H(32.5), size: 16, status: 'existing' },
      { from: H(32.5), to: H(12.5), size: 14, status: 'existing' },
      { from: H(12.5), to: H(3.0), size: 12, status: 'existing', capped: true },
    ],
    ret: { size: 16, status: 'new', turnX: H(24.5), grilleY: 11.6, option: 18 },
    branches: [
      { id: 'gbath', room: 'Guest bath', size: 6, status: 'existing', reg: [H(36.3), 10.5] },
      { id: 'office', room: 'Office', size: 6, status: 'existing', reg: [H(32.6), 28.3] },
      { id: 'gbed', room: 'Guest bedroom', size: 7, status: 'existing', reg: [H(33.4), 2.6] },
      { id: 'living', room: 'Living room', size: 8, status: 'new', was: 6, reg: [H(24.5), 28.3] },
      { id: 'master', room: 'Master bedroom', size: 8, status: 'new', was: 6, reg: [H(12.4), 1.0] },
      { id: 'dining', room: 'Dining room', size: 8, status: 'new', was: 6, reg: [H(12.5), 28.3] },
      { id: 'mbath', room: 'Master bath', size: 6, status: 'existing', reg: [H(4.9), 15.5] },
      { id: 'garage', room: 'Garage', size: 7, status: 'new', reg: [13.5, 11.3], side: true, tapX: H(4.6), viaY: 11.3, note: 'saddle tap on the SIDE of the 12" trunk · through the brick · up the garage wall · damper at the register' },
    ],
    wire: { from: [H(40.2), 12.6], to: [H(24.5), 13.4] },
    scope: [
      ['Unit connections', 'New square-to-round transitions on both supply and return at the package unit. Remove the existing twisted connections.'],
      ['Return', 'New 16" insulated flex straight back from the unit, a sheet-metal 90 across the supply trunk, a second sheet-metal 90 into the return filter grille. 16" runs about 713 ft/min at 995 CFM (the Manual D flex maximum) — quote 18" (about 563 ft/min) as an option.'],
      ['Return filter grille', 'The existing 20 × 25 grille stays — 3.5 sq ft of face, about 287 ft/min at design airflow.'],
      ['Upgrade 6" → 8"', 'Dining room, master bedroom, living room — each with a new saddle tap, balancing damper and boot.'],
      ['New 7" garage run', 'Saddle tap on the side of the 12" supply trunk (not off the trunk end); core through the brick and seal; turn up and run up the garage wall to a boot and brown register; balancing damper at the register, inside the garage.'],
      ['Existing to remain', 'Supply trunk 16" → 14" → 12" with reducers; master bath 6", guest bedroom 7", office 6", guest bath 6". Inspect, re-seal, re-strap. Replace a run only if physically damaged — not for damp insulation.'],
      ['All flex', 'Fully extended, no kinks, sags or compression; supported per manufacturer; every joint sealed with mastic or UL 181 tape. State the insulation R-value on the quote.'],
      ['Thermostat', 'New 18 AWG thermostat wire with C-wire from the unit to the thermostat; install the owner’s thermostat.'],
      ['Start-up, on the invoice', 'Supply and return static pressure, dampers balanced, blower airflow set and recorded, refrigerant leak-detection tested where equipped.'],
      ['Clean-up', 'Old equipment and debris removed.'],
    ],
  };

  const meta = {
    title: 'Loewen House Plan',
    address: '301 S Aztec Dr · White House, TN 37188',
    rev: 'Rev 1',
    date: '22 Sep 2026',
    scaleNote: 'Shell and rooms from the Bosch GLM 20 laser walk of 22 Sep 2026 · 1 ft grid',
  };

  return { G, SB, HW, ED, KJ, KB, H, outline, rooms, dashedWalls, doors, bigDoors, windows, fixtures, yard, cats, devices, cans, duct, meta };
})();
