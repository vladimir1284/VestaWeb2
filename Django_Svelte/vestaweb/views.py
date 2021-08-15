from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist
import pytz
import numpy as np

# Retrieve the latest raster product
def last_raster(request, radar):
    radar = Radar.objects.get(radar_code = radar)
    product = RasterProduct.objects.filter(radar=radar).order_by('-created')[0]
    last_product = {'datetime': product.created}
    return JsonResponse(last_product)

# Retrieve the latest raster product
def raster_array(request, radar, pcode, dt, n):
    radar = Radar.objects.get(radar_code = radar)
    description = ProductDescription.objects.get(pcode=pcode)
    product_array = RasterProduct.objects.filter(radar=radar, 
                    description=description).filter(created__lte=dt).order_by('-created')[:n]
    product_array = [{'datetime': product.created} for product in product_array]
    
    return JsonResponse({'product_array':product_array,
                        'radar': radar.radar_code,
                         'pcode': pcode})

# Retrieve the closest raster product to the given datetime
def get_closest_raster(request, radar, pcode, dt):
    radar = Radar.objects.get(radar_code = radar)
    description = ProductDescription.objects.get(pcode=pcode)

    closest_greater_qs = RasterProduct.objects.filter(radar=radar, 
                        description=description).filter(created__gte=dt).order_by('created')
    closest_less_qs    = RasterProduct.objects.filter(radar=radar, 
                        description=description).filter(created__lte=dt).order_by('-created')
    product = False
    try:
        try:
            closest_greater = closest_greater_qs[0]
        except IndexError:
            product = closest_less_qs[0]
        try:
            closest_less = closest_less_qs[0]
        except IndexError:
            product = closest_greater_qs[0]
    except IndexError:
        return JsonResponse({'error': "there are no objects"})
        # raise ProductDescription.DoesNotExist("There is no closest object"
        #                             " because there are no objects.")
    if (not(product)):
        dt = datetime.strptime(dt, "%Y-%m-%dT%H:%M:%SZ")
        timezone = pytz.timezone('UTC')
        dt = timezone.localize(dt)
        if closest_greater.created - dt > dt - closest_less.created:
            product = closest_less
        else:
            product = closest_greater

    closest_product = {'datetime': product.created,
                    'palette': product.description.palette.name,
                    'id': pcode,
                    'range':  product.description.range}
    return JsonResponse({'product': closest_product,
                         'radar': radar.radar_code,
                         'pcode': pcode})
    
# Retrieve the previous product
def get_previous_raster(request, radar, pcode, dt):
    radar = Radar.objects.get(radar_code = radar)
    description = ProductDescription.objects.get(pcode=pcode)
    previous_qs    = RasterProduct.objects.filter(radar=radar, 
                        description=description).filter(created__lt=dt).order_by('-created')
    try:
        product = previous_qs[0]
        previous = {'datetime': product.created,
                    'palette': product.description.palette.name,
                    'id': pcode,
                    'range':  product.description.range}
        return JsonResponse({'product': previous,
                         'radar': radar.radar_code,
                         'pcode': pcode})
    except IndexError:
        return JsonResponse({'error': 'No previous product available'})
    
# Retrieve the next product
def get_next_raster(request, radar, pcode, dt):
    radar = Radar.objects.get(radar_code = radar)
    description = ProductDescription.objects.get(pcode=pcode)
    next_qs    = RasterProduct.objects.filter(radar=radar, 
                        description=description).filter(created__gt=dt).order_by('created')
    try:
        product = next_qs[0]
        next_product = {'datetime': product.created,
                    'palette': product.description.palette.name,
                    'id': pcode,
                    'range':  product.description.range}
        return JsonResponse({'product': next_product,
                         'radar': radar.radar_code,
                         'pcode': pcode})
    except IndexError:
        return JsonResponse({'error': 'No next product available'})

# Retrieve the palette object
def get_palette(request, palette_name):
    palette = Palette.objects.get(name = palette_name)
    palette_dict = {'colors': palette.colors,
                    'min': palette.min_value,
                    'max': palette.max_value,
                    'unit': palette.unit,
                    'tickValues': palette.tickValues}
    return JsonResponse({'palette_name': palette_name,
                         'palette': palette_dict})

# Retrieve available products
def get_available(request, radar, dt):
    radar = Radar.objects.get(radar_code = radar)
    products = RasterProduct.objects.filter(radar=radar, created=dt)
    available_products = [product.description.pcode for product in products]
    return JsonResponse({'available_products': available_products,
                         'radar': radar.radar_code,
                         'datetime': dt})



# Retrieve N storm cells
def get_Nstorm_cells(request, radar, n, dt): 
    radar = Radar.objects.get(radar_code = radar)
    storm_cells = {}
    # Information of SS_62 product related to storm structure
    ss = StormCell.objects.filter(radar=radar, created=dt).order_by('label')
    # Information of STI_58 product related to storm trend
    sti = StormTracking.objects.filter(radar=radar, created=dt).order_by('label')
    # Create the final objects sorted by vil
    vils = []
    for cell in ss:
        vils.append(cell.vil[cell.lst_vol_data_ptr-1])
    index = np.argsort(vils).tolist()
    index.reverse()
    
    for i in index:
        cell = ss[i]
        storm_cells.setdefault(cell.label, {
            'id': cell.label,
            'azimut': cell.azimut, 
            'range':  cell.range,
            'tops': cell.tops,
            'bases': cell.bases,
            'max_ref_hgts': cell.max_ref_hgts,
            'centroids': cell.centroids,
            'poh': cell.poh,
            'posh': cell.posh,
            'vil': cell.vil,
            'maxZ': cell.maxZ,
            'lst_vol_data_ptr': cell.lst_vol_data_ptr
        })
    # Arrange times
    times = []
    if (len(vils) > 0):
        mins = cell.time
        last = cell.lst_vol_time_ptr
        ndata = len(mins)
        for i in range(ndata):
            idx = (last + i) % ndata
            times.append(mins[idx])
            
    n_sti = 0
    for cell in sti:
        try:
            storm_cells[cell.label].setdefault('Ipos', cell.Ipos)
            storm_cells[cell.label].setdefault('Jpos', cell.Jpos)
            storm_cells[cell.label].setdefault('past_Ipos', cell.past_Ipos)
            storm_cells[cell.label].setdefault('past_Jpos', cell.past_Jpos)
            storm_cells[cell.label].setdefault('forecast_Ipos', cell.forecast_Ipos)
            storm_cells[cell.label].setdefault('forecast_Jpos', cell.forecast_Jpos)
            n_sti += 1
        except KeyError:
            pass
    
    sc = list(storm_cells.values())[:n]
    return JsonResponse({'storm_cells': sc,
                         'radar': radar.radar_code,
                         'datetime': dt,
                         'times': times,
                         'n_sc': len(sc)})
    
    
# Retrieve storm cells
def get_storm_cells(request, radar, dt):  
    return get_Nstorm_cells(request, radar, None, dt)

# Retrieve storm structure adaptation data 
def get_ss_adata(request, radar, dt):  
    radar = Radar.objects.get(radar_code = radar) 
    cell = StormCell.objects.filter(radar=radar, created=dt)[0]
    return JsonResponse({'adata': cell.adata.body,
                         'radar': radar.radar_code,
                         'datetime': dt})
    
# Retrieve radars
def get_radars(request):
    radars = Radar.objects.all().order_by('longitude')
    radar_list = {}
    for radar in radars:
        last_obs_qs = RasterProduct.objects.filter(
                    radar=radar).order_by('-created')
        try:
            last_obs = last_obs_qs[0].created
        except IndexError:
            last_obs = ""
        radar_list[radar.radar_code] = ({
                    'id': radar.radar_code,
                    'name': radar.name,
                    'location': {'lat': radar.latitude, 
                                 'lon': radar.longitude},
                    'status': radar.status,
                    'last': last_obs})
            
    return JsonResponse({'radars': radar_list})
    
# Retrieve product description
def getProductDescription(request, pcode):
    description = ProductDescription.objects.get(pcode=pcode)
    description = {
                    'id': description.pcode,
                    'range':description.range,
                    'palette': {'colors': description.palette.colors,
                                'min': description.palette.min_value,
                                'max': description.palette.max_value,
                                'unit': description.palette.unit,
                                'tickValues': description.palette.tickValues}
                    }
    return JsonResponse({'description': description})
    
  
# Retrieve storm cells
def get_vwp(request, radar, dt):    
    radar = Radar.objects.get(radar_code = radar)

    # Information of SS_62 product related to storm structure
    try:
        vwp = VWP.objects.get(radar=radar, created=dt)
        vwp_data = []
        for i in range(len(vwp.hts)):
            vwp_data.append({
                'ht':  vwp.hts[i],
                'u':    vwp.u[i], 
                'v':    vwp.v[i],
                'w':    vwp.w[i],
                'dir':    vwp.dir[i],
                'rms':  vwp.rms[i],
                'div':  vwp.div[i],
                'srng': vwp.srng[i],
                'elev': vwp.elev[i]
            })
    except ObjectDoesNotExist:
        vwp_data = {}
    return JsonResponse({'vwp': vwp_data,
                         'radar': radar.radar_code,
                         'datetime': dt})  
    
  
# # Retrieve VWP data
# def get_vwp(request, radar, dt):    
#     radar = Radar.objects.get(radar_code = radar)
#
#     # Information of SS_62 product related to storm structure
#     try:
#         vwp = VWP.objects.get(radar=radar, created=dt)
#         vwp_data = []
#         for i in range(len(vwp.hts)):
#             vwp_data.append({
#                 'ht':  vwp.hts[i],
#                 'u':    vwp.u[i], 
#                 'v':    vwp.v[i],
#                 'w':    vwp.w[i],
#                 'dir':    vwp.dir[i],
#                 'rms':  vwp.rms[i],
#                 'div':  vwp.div[i],
#                 'srng': vwp.srng[i],
#                 'elev': vwp.elev[i]
#             })
#     except ObjectDoesNotExist:
#         vwp_data = {}
#     return JsonResponse({'vwp': vwp_data,
#                          'radar': radar.radar_code,
#                          'datetime': dt})  
#

   
# Retrieve VWP data array
def get_vwp_array(request, radar, dt, n, step):    
    radar = Radar.objects.get(radar_code = radar)
    vwp_array = VWP.objects.filter(radar=radar).filter(created__lte=dt).order_by('-created')[:(n*step)]
    vwp_data = []
    # Processing on a step interval
    for vwp in vwp_array[0::step]: 
        data = []
        for i in range(len(vwp.hts)):
            data.append({
                'ht':  vwp.hts[i],
                'vel':    (vwp.u[i]**2 + vwp.v[i]**2)**0.5, 
                'dir':    vwp.dir[i],
                'rms':  vwp.rms[i],
            })
        vwp_data.append({'datetime': vwp.created, 'data': data})
        
    return JsonResponse({'vwp': vwp_data,
                         'radar': radar.radar_code,
                         'len': len(vwp_data),
                         'n': n,
                         'setp': step})  
    
 
    
    
    