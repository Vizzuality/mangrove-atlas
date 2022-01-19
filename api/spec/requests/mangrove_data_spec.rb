require 'rails_helper'

RSpec.describe "MangroveData", type: :request do
  let!(:location) { create(:location) }
  let!(:mangrove_data) { create_list(:mangrove_datum, 20, location_id: location.id) }
  let(:location_id) { location.id }
  let(:id) { mangrove_data.first.id }

  # Test suite for GET /locations/:location_id/mangrove_data
  describe 'GET /locations/:location_id/mangrove_data' do
    before { get "/locations/#{todo_id}/mangrove_data" }

    context 'when location exists' do
      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns all location mangrove data' do
        expect(json.size).to eq(20)
      end
    end
  end
end
