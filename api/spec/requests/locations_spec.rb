require 'rails_helper'

RSpec.describe 'Locations API', type: :request do
  # initialize test data
  let!(:locations) { create_list(:location, 10) }
  let(:location_id) { locations.first.id }

  # Test suite for GET /locations
  describe 'GET /locations' do
    # make HTTP get request before each example
    before { get '/locations' }

    it 'returns locations' do
      # Note `json` is a custom helper to parse JSON responses
      expect(json).not_to be_empty
      expect(json.size).to eq(10)
    end

    it 'returns status code 200' do
      expect(response).to have_http_status(200)
    end
  end

  # Test suite for GET /locations/:id
  describe 'GET /locations/:id' do
    before { get "/locations/#{location_id}" }

    context 'when the record exists' do
      it 'returns the location' do
        expect(json).not_to be_empty
        expect(json['id']).to eq(location_id)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the record does not exist' do
      let(:location_id) { 100 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Location/)
      end
    end
  end

  # Test suite for POST /locations
  describe 'POST /locations' do
    # valid payload
    let(:valid_attributes) { { name: 'Rufiji', location_type: 'aoi', iso: 'TZA' } }

    context 'when the request is valid' do
      before { post '/locations', params: valid_attributes }

      it 'creates a location' do
        expect(json['name']).to eq('Rufiji')
      end

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when the request is invalid' do
      before { post '/locations', params: { name: 'Saloum' } }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns a validation failure message' do
        expect(response.body)
          .to match(/Validation failed: Location type can't be blank/)
      end
    end
  end

  # Test suite for PUT /locations/:id
  describe 'PUT /locations/:id' do
    let(:valid_attributes) { { name: 'Saloum' } }

    context 'when the record exists' do
      before { put "/locations/#{location_id}", params: valid_attributes }

      it 'updates the record' do
        expect(response.body).to be_empty
      end

      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end
    end
  end

  # Test suite for DELETE /locations/:id
  describe 'DELETE /locations/:id' do
    before { delete "/locations/#{location_id}" }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end
  end
end
