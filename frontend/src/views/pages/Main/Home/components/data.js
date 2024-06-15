const inOutSlot = [
  {
    key: 'zone',
    dataIndex: ['parkingTurn', 'position']
  },
  {
    key: 'position',
    dataIndex: ['parkingTurn', 'position']
  }
];

export const EventDisplay = [
  {
    eventType: 'default',
    displayProps: [
      {
        key: 'zone',
        dataIndex: ['zone']
      },
      {
        key: 'position',
        dataIndex: ['parkingTurn', 'position']
      }
    ]
  },
  {
    eventType: 'inSlot',
    displayProps: inOutSlot
  },
  {
    eventType: 'outSlot',
    displayProps: inOutSlot
  }
];
