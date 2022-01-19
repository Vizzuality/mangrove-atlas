require "test_helper"

class WidgetsControllerTest < ActionDispatch::IntegrationTest
  test "should get species" do
    get widgets_species_url
    assert_response :success
  end
end
