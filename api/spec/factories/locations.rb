FactoryBot.define do
  factory :location do
    name { Faker::Nation.capital_city }
    location_type { Faker::Lorem.word }
    iso { Faker::Lorem.word }
  end
end