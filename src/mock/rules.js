// Sample rule text for development. The real content will be supplied by the hostel office.
export function getRules() {
  return {
    updatedAt: '2026-07-01',
    sections: [
      { id: 'general', title: 'General rules', rules: [
        'Every resident must carry the hostel identity card and show it when asked.',
        'Rooms must be kept clean and tidy. Periodic room inspections may be carried out.',
        'Furniture and fittings must not be moved out of the room or damaged.',
        'Cooking and the use of heating appliances inside rooms is not allowed.',
      ] },
      { id: 'timings', title: 'Timings', rules: [
        'Hostel gates close at 9:30 PM. Late entry requires prior permission from the warden.',
        'Quiet hours are observed from 11:00 PM to 6:00 AM.',
        'Mess meals are served only during the posted timings.',
      ] },
      { id: 'discipline', title: 'Discipline', rules: [
        'Residents must treat staff and fellow residents with respect.',
        'Smoking, alcohol and prohibited substances are strictly not allowed on the premises.',
        'Ragging in any form is prohibited and is a punishable offence.',
      ] },
      { id: 'safety', title: 'Safety', rules: [
        'Do not tamper with electrical fittings or overload sockets.',
        'Report any electrical, fire or water hazard immediately through the complaints section.',
        'Know the location of fire exits on your floor and take part in safety drills.',
      ] },
      { id: 'visitors', title: 'Visitor rules', rules: [
        'Visitors are allowed in the visitor area only, between 10:00 AM and 6:00 PM.',
        'Visitors must register at the gate and carry a valid photo ID.',
        'Overnight stay of visitors is not permitted.',
      ] },
      { id: 'other', title: 'Other instructions', rules: [
        'Room changes are made only by the warden. Submit a request through the Room Request page.',
        'Residents are responsible for the belongings kept in their rooms.',
        'Official notices are published on the Notices page; residents are expected to read them.',
      ] },
    ],
  };
}
