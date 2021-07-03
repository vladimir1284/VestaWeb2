import { writable, readable } from 'svelte/store'
import { refl_16, hires_refl, et_16 } from './palettes.js';
var { DateTime } = require('luxon');

export const product_base_url = readable('imgs/')

export const current_datetime = writable(DateTime.utc(1993, 3, 13, 10, 33))

const ccnr = {
    'id': 'CCNR',
    'name': 'Centro Nacional de Radares',
    'location': {'lat': 21.4233, 'lon':-77.8487}
}

const ccsb = {
    'id': 'CCSB',
    'name': 'Casa Blanca',
    'location': {'lat': 23.1495, 'lon':-82.3500}
}

export const radars = readable([ccnr, ccsb])

export const currentRadar = writable(ccnr)

const cr_38 = {
    'id': "CR_38",
    'range':464000,
    'name': "Máximos 640km",
    'palette': refl_16
}
const dr_94 = {
    'id': "DR_94",
    'range':464000,
    'name': "Reflectividad base",
    'palette': hires_refl
}
const et_41 = {
    'id': "ET_41",
    'range':232000,
    'name': "Topes",
    'palette': et_16
}

export const availableProducts = writable([
    dr_94,
    cr_38,
    et_41
])

export const currentProduct = writable(dr_94)

export const defaultProductOpacity = writable(0.5)

export const mapProj = readable('EPSG:2085')

export const mapExtend = readable([-302183.53173887, -409851.12978591, 
                                    1497816.46826113, 790148.87021409])

let B3 = {'id': 'B3', 'azimut':147, 'range':120,
'tops':[29.4, 39.1, ],
'bases':[116.6, 116.1, ],
'max_ref_hgts':[16.6, 16.1, ],
'centroids':[17.2, 17.3, ],
'poh':[100, 90, ],
'posh':[40, 40, ],
'vil':[36, 44, ],
'maxZ':[54, 57, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let G2 = {'id': 'G2', 'azimut':44, 'range':132,
'tops':[29.9, 29.8, 31.6, 46.7, ],
'bases':[116.5, 117.3, 117.8, 118.9, ],
'max_ref_hgts':[16.5, 17.3, 17.8, 18.9, ],
'centroids':[16.7, 17.4, 19.7, 20.8, ],
'poh':[70, 64537, 64537, 64537, ],
'posh':[10, 64537, 64537, 64537, ],
'vil':[20, 22, 30, 40, ],
'maxZ':[51, 51, 52, 53, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let F3 = {'id': 'F3', 'azimut':141, 'range':136,
'tops':[34.4, ],
'bases':[119.9, ],
'max_ref_hgts':[19.9, ],
'centroids':[21.2, ],
'poh':[64537, ],
'posh':[64537, ],
'vil':[30, ],
'maxZ':[52, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let J2 = {'id': 'J2', 'azimut':101, 'range':69,
'tops':[25.4, 26.0, 26.8, 27.7, ],
'bases':[18.7, 12.8, 13.3, 106.7, ],
'max_ref_hgts':[18.7, 12.8, 13.3, 6.7, ],
'centroids':[19.9, 13.5, 13.8, 9.0, ],
'poh':[60, 80, 40, 40, ],
'posh':[0, 10, 10, 0, ],
'vil':[5, 15, 14, 27, ],
'maxZ':[48, 55, 58, 55, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let G0 = {'id': 'G0', 'azimut':46, 'range':93,
'tops':[35.3, 37.5, 30.2, 32.5, 27.6, 28.0, 19.7, ],
'bases':[106.3, 14.0, 107.4, 15.8, 108.7, 109.6, 110.7, ],
'max_ref_hgts':[19.6, 14.0, 7.4, 15.8, 8.7, 9.6, 10.7, ],
'centroids':[10.2, 17.7, 10.2, 19.0, 9.1, 10.0, 10.8, ],
'poh':[100, 90, 90, 90, 70, 70, 80, ],
'posh':[30, 30, 20, 20, 10, 10, 0, ],
'vil':[29, 18, 30, 14, 27, 29, 26, ],
'maxZ':[54, 54, 54, 53, 55, 55, 55, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let G3 = {'id': 'G3', 'azimut':41, 'range':118,
'tops':[28.8, ],
'bases':[115.6, ],
'max_ref_hgts':[15.6, ],
'centroids':[15.9, ],
'poh':[70, ],
'posh':[10, ],
'vil':[23, ],
'maxZ':[52, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let R1 = {'id': 'R1', 'azimut':115, 'range':91,
'tops':[41.2, 25.9, 35.5, 43.1, 45.6, 37.2, ],
'bases':[33.1, 17.6, 108.9, 18.9, 109.8, 20.0, ],
'max_ref_hgts':[33.1, 17.6, 8.9, 18.9, 9.8, 20.0, ],
'centroids':[35.5, 18.2, 11.7, 22.3, 10.8, 22.3, ],
'poh':[0, 100, 100, 100, 100, 100, ],
'posh':[0, 30, 30, 40, 50, 40, ],
'vil':[5, 15, 38, 21, 46, 19, ],
'maxZ':[45, 54, 56, 54, 57, 54, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let H3 = {'id': 'H3', 'azimut':136, 'range':116,
'tops':[27.4, ],
'bases':[115.2, ],
'max_ref_hgts':[15.2, ],
'centroids':[16.9, ],
'poh':[60, ],
'posh':[0, ],
'vil':[17, ],
'maxZ':[50, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let I3 = {'id': 'I3', 'azimut':84, 'range':72,
'tops':[36.5, ],
'bases':[15.1, ],
'max_ref_hgts':[15.1, ],
'centroids':[19.1, ],
'poh':[80, ],
'posh':[10, ],
'vil':[16, ],
'maxZ':[54, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let J3 = {'id': 'J3', 'azimut':93, 'range':84,
'tops':[18.5, ],
'bases':[108.8, ],
'max_ref_hgts':[8.8, ],
'centroids':[12.7, ],
'poh':[0, ],
'posh':[0, ],
'vil':[12, ],
'maxZ':[50, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let D3 = {'id': 'D3', 'azimut':66, 'range':75,
'tops':[28.6, 30.9, ],
'bases':[14.5, 22.9, ],
'max_ref_hgts':[14.5, 22.9, ],
'centroids':[15.2, 24.1, ],
'poh':[90, 90, ],
'posh':[30, 50, ],
'vil':[18, 12, ],
'maxZ':[55, 55, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let B2 = {'id': 'B2', 'azimut':135, 'range':105,
'tops':[38.2, 40.2, 40.9, 22.0, 33.7, ],
'bases':[29.9, 30.2, 111.6, 112.1, 24.6, ],
'max_ref_hgts':[29.9, 30.2, 11.6, 12.1, 24.6, ],
'centroids':[31.0, 30.7, 11.9, 13.4, 27.4, ],
'poh':[0, 100, 100, 90, 100, ],
'posh':[0, 0, 40, 40, 30, ],
'vil':[4, 5, 42, 38, 10, ],
'maxZ':[42, 46, 56, 56, 50, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let K3 = {'id': 'K3', 'azimut':138, 'range':109,
'tops':[35.1, ],
'bases':[25.8, ],
'max_ref_hgts':[25.8, ],
'centroids':[28.4, ],
'poh':[100, ],
'posh':[10, ],
'vil':[9, ],
'maxZ':[47, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let L3 = {'id': 'L3', 'azimut':71, 'range':94,
'tops':[21.4, ],
'bases':[110.9, ],
'max_ref_hgts':[10.9, ],
'centroids':[11.6, ],
'poh':[0, ],
'posh':[0, ],
'vil':[7, ],
'maxZ':[45, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let M3 = {'id': 'M3', 'azimut':131, 'range':63,
'tops':[12.6, ],
'bases':[106.1, ],
'max_ref_hgts':[12.6, ],
'centroids':[12.4, ],
'poh':[10, ],
'posh':[0, ],
'vil':[7, ],
'maxZ':[51, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let N3 = {'id': 'N3', 'azimut':151, 'range':136,
'tops':[46.6, ],
'bases':[34.3, ],
'max_ref_hgts':[34.3, ],
'centroids':[35.2, ],
'poh':[64537, ],
'posh':[64537, ],
'vil':[7, ],
'maxZ':[46, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let O3 = {'id': 'O3', 'azimut':56, 'range':85,
'tops':[35.3, ],
'bases':[26.6, ],
'max_ref_hgts':[26.6, ],
'centroids':[29.3, ],
'poh':[100, ],
'posh':[20, ],
'vil':[6, ],
'maxZ':[48, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let X2 = {'id': 'X2', 'azimut':104, 'range':88,
'tops':[41.9, 34.6, 37.0, ],
'bases':[33.7, 18.5, 27.9, ],
'max_ref_hgts':[33.7, 18.5, 27.9, ],
'centroids':[35.4, 24.1, 30.6, ],
'poh':[0, 100, 100, ],
'posh':[0, 30, 0, ],
'vil':[3, 17, 5, ],
'maxZ':[42, 54, 46, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let P3 = {'id': 'P3', 'azimut':33, 'range':81,
'tops':[18.1, ],
'bases':[108.6, ],
'max_ref_hgts':[8.6, ],
'centroids':[8.7, ],
'poh':[0, ],
'posh':[0, ],
'vil':[5, ],
'maxZ':[43, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let Q3 = {'id': 'Q3', 'azimut':131, 'range':95,
'tops':[39.3, ],
'bases':[30.5, ],
'max_ref_hgts':[30.5, ],
'centroids':[31.5, ],
'poh':[0, ],
'posh':[0, ],
'vil':[5, ],
'maxZ':[44, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let R3 = {'id': 'R3', 'azimut':123, 'range':92,
'tops':[38.2, ],
'bases':[29.5, ],
'max_ref_hgts':[29.5, ],
'centroids':[32.7, ],
'poh':[0, ],
'posh':[0, ],
'vil':[4, ],
'maxZ':[43, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let Y2 = {'id': 'Y2', 'azimut':257, 'range':12,
'tops':[5.1, 3.7, 4.4, ],
'bases':[101.3, 101.0, 100.7, ],
'max_ref_hgts':[5.1, 1.0, 2.0, ],
'centroids':[3.3, 1.8, 2.4, ],
'poh':[0, 0, 0, ],
'posh':[0, 0, 0, ],
'vil':[2, 2, 2, ],
'maxZ':[44, 46, 48, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
let X0 = {'id': 'X0', 'azimut':328, 'range':23,
'tops':[9.4, 8.3, 7.6, 6.6, 3.9, 3.7, 3.8, ],
'bases':[102.7, 102.2, 101.9, 101.7, 101.5, 101.4, 101.5, ],
'max_ref_hgts':[6.4, 5.5, 1.9, 4.4, 1.5, 1.4, 1.5, ],
'centroids':[4.1, 4.4, 3.5, 3.9, 2.2, 2.3, 2.6, ],
'poh':[0, 0, 0, 0, 0, 0, 0, ],
'posh':[0, 0, 0, 0, 0, 0, 0, ],
'vil':[5, 6, 6, 5, 2, 1, 1, ],
'maxZ':[48, 50, 52, 51, 48, 43, 42, ],
'time':[602, 607, 612, 617, 622, 628, 633, ],
}
B3.Ipos=120250;B3.Jpos=-186750;B3.past='120250 -186750,111250 -196750';B3.forecast='120250 -186750,146750 -157000';
G2.Ipos=169500;G2.Jpos=176500;G2.past='169500 176500,166750 167000,166500 161250,165500 153000';G2.forecast='169500 176500,173250 198750';
F3.Ipos=158250;F3.Jpos=-196750;F3.past='';F3.forecast='';
J2.Ipos=125250;J2.Jpos=-23500;J2.past='125250 -23500,118500 -30250,112250 -37000,107000 -46500';J2.forecast='125250 -23500,143250 -1250,161250 20750,179500 43000,197500 65000';
G0.Ipos=124250;G0.Jpos=120500;G0.past='124250 120500,119500 108750,115250 98750,113750 83250,110750 77750,109250 67000,106500 60750';G0.forecast='124250 120500,132500 150000,140500 179500';
G3.Ipos=142500;G3.Jpos=164750;G3.past='';G3.forecast='';
R1.Ipos=152500;R1.Jpos=-71000;R1.past='152500 -71000,142250 -80500,136500 -84500,126750 -88000,119250 -95500,108000 -102000';R1.forecast='152500 -71000,177500 -54000';
H3.Ipos=148000;H3.Jpos=-155000;H3.past='';H3.forecast='';
I3.Ipos=133500;I3.Jpos=13250;I3.past='';I3.forecast='';
J3.Ipos=154750;J3.Jpos=-7250;J3.past='';J3.forecast='';
D3.Ipos=127000;D3.Jpos=55500;D3.past='127000 55500,122000 47000';D3.forecast='127000 55500,142000 80500,157000 105750';
B2.Ipos=138250;B2.Jpos=-137750;B2.past='138250 -137750,127750 -135000,122250 -134250,113250 -132500,104000 -137500';B2.forecast='138250 -137750,162500 -138500';
K3.Ipos=134250;K3.Jpos=-151000;K3.past='';K3.forecast='';
L3.Ipos=165000;L3.Jpos=57500;L3.past='';L3.forecast='';
M3.Ipos=87750;M3.Jpos=-77250;M3.past='';M3.forecast='';
N3.Ipos=120500;N3.Jpos=-220250;N3.past='';N3.forecast='';
O3.Ipos=130500;O3.Jpos=87250;O3.past='';O3.forecast='';
X2.Ipos=158500;X2.Jpos=-39250;X2.past='158500 -39250,149500 -47500,142250 -50250';X2.forecast='158500 -39250,182000 -23250';
P3.Ipos=82000;P3.Jpos=126000;P3.past='';P3.forecast='';
Q3.Ipos=131500;Q3.Jpos=-116000;Q3.past='';Q3.forecast='';
R3.Ipos=142500;R3.Jpos=-93000;R3.past='';R3.forecast='';
Y2.Ipos=-21750;Y2.Jpos=-5000;Y2.past='-21750 -5000,-28000 -8750,-34500 -14250';Y2.forecast='-21750 -5000,-3000 8750,15500 22250,34250 36000,53000 49500';
X0.Ipos=-22500;X0.Jpos=36000;X0.past='-22500 36000,-29750 27750,-39500 17250,-45000 14000,-51000 10750,-57000 6750,-66500 -1750';X0.forecast='-22500 36000,-1750 53000,19000 69750';


export const storms = writable([B3, G2, F3, J2, G0,
                                G3, R1, H3, I3, J3,
                                D3, B2, K3, L3, M3,
                                N3, O3, X2, P3, Q3,
                                R3, Y2, X0])

export const adata =writable(`                       STORM CELL SEGMENTS ADAPTATION DATA \n                     
                                                                                
60(DBZ) THRESH (REFLECTIVITY #1)      1.9  (KM) THRESH (SEGMENT LENGTH #1)  
55(DBZ) THRESH (REFLECTIVITY #2)      1.9  (KM) THRESH (SEGMENT LENGTH #2)  
50(DBZ) THRESH (REFLECTIVITY #3)      1.9  (KM) THRESH (SEGMENT LENGTH #3)  
45(DBZ) THRESH (REFLECTIVITY #4)      1.9  (KM) THRESH (SEGMENT LENGTH #4)  
40(DBZ) THRESH (REFLECTIVITY #5)      1.9  (KM) THRESH (SEGMENT LENGTH #5)  
35(DBZ) THRESH (REFLECTIVITY #6)      1.9  (KM) THRESH (SEGMENT LENGTH #6)  
30(DBZ) THRESH (REFLECTIVITY #7)      1.9  (KM) THRESH (SEGMENT LENGTH #7)  
 7      NBR REFLECTIVITY LEVELS         5 (DBZ) THRESH (DROPOUT REF DIFF)   
 3      REFLECTIVITY AVG FACTOR         2       THRESH (DROPOUT  COUNT)     
460 (KM) THRESH (MAX SEGMENT RANGE)   6000       MAX # OF SEGMENTS/ELEV      
1.37      MASS COEFFICIENT FACTOR        15       MAX # OF SEGMENTS/RADIAL    
486.0      MASS MULTIPLICATIVE FACTOR                                          
53000.0 (HR*KG/KM**4) MASS WEIGHTED FACTOR                                     
                STORM CELL CENTROIDS ADAPTATION DATA                        
                                                                            
10.0 (KM**2) THRESH (COMPONENT AREA #1)      2 (BIN) THRESH (SEGMENT OVERLAP)  
10.0 (KM**2) THRESH (COMPONENT AREA #2)    1.5 (DEG) THRESH (AZ SEPARATION)    
10.0 (KM**2) THRESH (COMPONENT AREA #3)   4.00  (KM) THRESH (DEPTH DELETE)     
10.0 (KM**2) THRESH (COMPONENT AREA #4)    5.0  (KM) THRESH (HORIZONTAL DELETE)
10.0 (KM**2) THRESH (COMPONENT AREA #5)    3.0 (DEG) THRESH (ELEVATION MERGE)  
10.0 (KM**2) THRESH (COMPONENT AREA #6)    4.0  (KM) THRESH (HEIGHT MERGE)     
10.0 (KM**2) THRESH (COMPONENT AREA #7)   10.0  (KM) THRESH (HORIZONTAL MERGE) 
5.0    (KM) THRESH (SEARCH RADIUS #1)       2       THRESH (# SEGMENTS/COMP)  
7.5    (KM) THRESH (SEARCH RADIUS #2)     120       THRESH (MAX COMPS/ELEV)   
10.0    (KM) THRESH (SEARCH RADIUS #3)      70       THRESH (MAX POT COMPS/ELV)
120 (KG/M**2) THRESH (MX CELL-BASED VIL)  100       THRESH (MAX CELLS/VOL)    
                                        130       THRESH (MX DETECTED CELLS)
          STORM CELL TRACKING/FORECAST ADAPTATION DATA                      
                                                                            
225   (DEG) DEFAULT (DIRECTION)      2.5   (M/S) THRESH (MINIMUM SPEED)     
25.0   (KTS) DEFAULT (SPEED)           20    (KM) ALLOWABLE ERROR            
 20   (MIN) TIME (MAXIMUM)            15   (MIN) FORECAST INTERVAL          
 10         NUMBER OF PAST VOLUMES     4         NUMBER OF INTERVALS        
30.0   (M/S) CORRELATION SPEED         15   (MIN) ERROR INTERVAL             
                                                                            
                                                                            
          SCIT REFLECTIVITY MEDIAN FILTER                                   
                                                                            
7.0   (KM)  FILTER KERNEL SIZE       0.5         THRESH (FILTER FRACTION)   
Yes         REFLECTIVITY FILTERED                                           `)