require 'rails_helper'

RSpec.describe "Bananas", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/bananas/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/bananas/create"
      expect(response).to have_http_status(:success)
    end
  end

end
