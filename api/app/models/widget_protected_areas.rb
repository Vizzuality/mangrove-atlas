class WidgetProtectedAreas < ApplicationRecord
  require 'csv'

  belongs_to :location

  def self.import(file)
    CSV.foreach(file.path, headers: true) do |row|
      WidgetProtectedArea.create! row.to_hash
    end
  end
end
