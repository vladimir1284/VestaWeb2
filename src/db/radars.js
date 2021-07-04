var { DateTime } = require('luxon');

const ccnr = {
    'id': 'CCNR',
    'name': 'Centro Nacional de Radares',
    'location': {'lat': 21.4233, 'lon':-77.8487},
    'status': 'Activo',
    'last': DateTime.now()
}

const ccsb = {
    'id': 'CCSB',
    'name': 'Casa Blanca',
    'location': {'lat': 23.1495, 'lon':-82.3500},
    'status': 'Inactivo',
    'last': DateTime.local(2021, 7, 4, 12, 33)
}

export const radars = [ccnr, ccsb]