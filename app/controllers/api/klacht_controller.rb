class Api::KlachtController < ApplicationController

  before_action :authenticate, only: [:index]
  
  # Skip authentication for :create (POST)
  skip_before_action :authenticate, only: [:create]

  protect_from_forgery with: :null_session 
  
  def create
    klacht = Klacht.new(body_params)

    if klacht.save
      render json: { status: "success", item: body_params}
    else 
      render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def index
    klachten = Klacht.all
    render json: klachten
  end

  private

  def body_params
    params.require(:klacht).permit(:name, :description, :latitude, :longitude)
  end 
end
