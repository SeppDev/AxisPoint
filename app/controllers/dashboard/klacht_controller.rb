# frozen_string_literal: true

class Dashboard::KlachtController < InertiaController
  skip_before_action :authenticate
  before_action :perform_authentication

  def index
    # Return all klachten; the frontend map layout will provide filtering by status via tabs
    klachten = Klacht.all

    render inertia: {
      klachten: klachten.as_json(only: %i[id name description latitude longitude created_at updated_at status contact_email])
    }
  end

  def show
    klacht = Klacht.find_by!(id: params[:slug])

    render inertia: {
      klacht: klacht.as_json(only: %i[id name description latitude longitude created_at updated_at status contact_email]),
      image_url: klacht.image.attached? ? url_for(klacht.image) : nil
    }
  rescue ActiveRecord::RecordNotFound
    redirect_to root_path, alert: "That info page doesn't exist"
  end
end
