class V1::LocationsController < ApplicationController
  # deserializable_resource :location
  before_action :set_location, only: [:show, :update, :destroy]

  # GET /locations
  def index
    if params.has_key?(:rank_by)
      @locations = Location.rank_by_mangrove_data_column(params[:rank_by], params[:dir], params[:start_date] || '1996', params[:end_date] || '2019', params[:location_type], params[:limit] || 5)
    else
      @locations = []
      worldwide = Location.find_by(location_id: 'worldwide')
      @locations << worldwide if worldwide
      @locations += Location.all.where.not(location_id: 'worldwide').order(name: :asc)
    end

    @meta = Location.dates_with_data(params[:rank_by])

    if params.has_key?(:rank_by)
      render :rank
    else
      render :index
    end
  end

  # GET /locations/worldwide
  def worldwide
    @location = Location.worldwide
  end

  # POST /locations
  def create
    @location = Location.new(location_params)

    if @location.save
      render :create, :created
    else
      # json_response(@location.errors, :unprocessable_entity)
    end
  end

  # GET /locations/:id
  def show
  end

  # PUT /locations/:id
  def update
    if @location.update(location_params)
      render :update
    else
      # render :update, status: :unprocessable_entity
    end
  end

  # DELETE /locations/:id
  def destroy
    @location.destroy
    head :no_content
  end

  # Import data from CSV
  def import
    if (params[:reset])
      Location.destroy_all
    end
    Location.import(import_params)
    head :created
  end

  def import_geojson
    if (params[:reset])
      Location.destroy_all
    end
    Location.import_geojson(import_params)
    head :created
  end

  private

    def set_location
      next_location = Location.find_by(iso: params[:id], location_type: 'country')
      next_location = Location.find_by(location_id: params[:id]) unless next_location

      if next_location
        @location = next_location
      else
        @location = Location.find(params[:id].to_i)
      end
    end

    def location_params
      params.permit(:name, :location_type, :iso)
    end

    def import_params
      params.permit(:file)
    end
end
