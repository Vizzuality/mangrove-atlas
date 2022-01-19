FactoryBot.define do
  factory :mangrove_datum do
    date { Faker::Date }
    location_id { nil }
  end
end
