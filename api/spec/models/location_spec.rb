require 'rails_helper'

RSpec.describe Location, type: :model do
  # Association test
  it { should have_many(:mangrove_datum).dependent(:destroy) }

  # Validation tests
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:location_type) }
  it { should validate_presence_of(:iso) }
end
