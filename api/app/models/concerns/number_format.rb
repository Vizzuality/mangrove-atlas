require 'active_support/concern'

module NumberFormat
  extend ActiveSupport::Concern

  class_methods do
    def comma_conversion(value)
      if value and value.is_a?(String)
        value = value.gsub(',', '.')
      end
      value
    end
  end
end
