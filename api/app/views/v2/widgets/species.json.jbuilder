json.data do
  json.array! @species do |specie|
    json.value specie.value
  end
end