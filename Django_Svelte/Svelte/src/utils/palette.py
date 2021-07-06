file_name = "/home/vladimir/Dicso/Salvas-LAP-ene2017/Documents/Meteorologia/Vesta-PostGIS/Installer/palettes/et_16.plt"

fichero = open(file_name,'r')
         
length = int(fichero.readline())

red = [int(x) for x in fichero.readline().split()]
green = [int(x) for x in fichero.readline().split()]
blue = [int(x) for x in fichero.readline().split()]

str_arr = "["
for i in range(1,length):
    str_arr += "'#%.2X%.2X%.2X', " % (red[i], green[i], blue[i])    

str_arr = str_arr[:-2] + "]"

print(str_arr)

fichero.close()