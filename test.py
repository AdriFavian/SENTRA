from ultralytics import YOLO

model = YOLO("testkan_ini.pt")
print(model.names)
