require 'rails_helper'

RSpec.describe "Sigmas", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/sigma/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/sigma/create"
      expect(response).to have_http_status(:success)
    end
  end

end
