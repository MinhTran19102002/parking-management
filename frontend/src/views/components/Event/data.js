const persons = [
  {
    key: 'namePerson',
    dataIndex: ['person', 'name']
  },
  {
    key: 'phone',
    dataIndex: ['person', 'phone']
  }
];

const inOut = [
  {
    key: 'license',
    dataIndex: ['vehicle', 'licenePlate']
  },
  ...persons
];

const inOutSlot = [
  {
    key: 'zone',
    dataIndex: ['zone']
  },
  {
    key: 'position',
    dataIndex: ['parkingTurn', 'position']
  },
  {
    key: 'license',
    dataIndex: ['vehicle', 'licenePlate']
  },
  ...persons
];

export const EventDisplay = [
  {
    eventType: 'default',
    displayProps: [
      {
        key: 'license',
        dataIndex: ['vehicle', 'licenePlate']
      }
    ]
  },
  {
    eventType: 'in',
    displayProps: [...inOut]
  },
  {
    eventType: 'out',
    displayProps: [...inOut]
  },
  {
    eventType: 'inSlot',
    displayProps: [...inOutSlot]
  },
  {
    eventType: 'outSlot',
    displayProps: [...inOutSlot]
  }
];
