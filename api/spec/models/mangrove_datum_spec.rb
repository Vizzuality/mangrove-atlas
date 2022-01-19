require 'rails_helper'

RSpec.describe MangroveDatum, type: :model do
  # Association test
  it { should belong_to(:location) }
  # Validation tests
  it { should validate_presence_of(:date) }
end
