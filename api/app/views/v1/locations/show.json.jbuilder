json.data do
  json.partial! "location", obj: @location
  json.geometry @location.geometry
end