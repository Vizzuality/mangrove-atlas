class V2::WidgetsController < ApplicationController
  def protected_areas
    @protected_areas = WidgetProtectedAreas.where(location_id: params[:location_id])
  end

  def protected_areas_import
    WidgetProtectedAreas.destroy_all
    WidgetProtectedAreas.import(params[:file])
  end

  def species
    @species = Specie.all
  end

  def species_import
  end
end