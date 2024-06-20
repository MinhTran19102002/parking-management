const inOut = [
  {
    key: 'license',
    dataIndex: ['vehicle', 'licenePlate']
  }
];

const inOutSlot = [
  {
    key: 'zone',
    dataIndex: ['parkingTurn', 'zone']
  },
  {
    key: 'position',
    dataIndex: ['parkingTurn', 'position']
  },
  {
    key: 'license',
    dataIndex: ['vehicle', 'licenePlate']
  }
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
