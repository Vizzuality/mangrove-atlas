class V2::LocationsController < ApplicationController
  # deserializable_resource :location
  before_action :set_location, only: [:show, :update, :destroy]

  # GET /locations
  def index
    @locations = []
    worldwide = Location.find_by(location_id: 'worldwide')
    @locations << worldwide if worldwide
    @locations += Location.all.where.not(location_id: 'worldwide').order(name: :asc)

    @dates = Location.dates_with_data(params[:rank_by])
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
      render :create, :unprocessable_entity
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
      render :update, status: :unprocessable_entity
    end
  end

  # DELETE /locations/:id
  def destroy
    @location.destroy
    head :no_content
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
