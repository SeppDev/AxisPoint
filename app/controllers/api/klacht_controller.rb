class Api::KlachtController < ApplicationController
  before_action :authenticate, only: [:index]

  # Skip authentication for :create (POST)
  skip_before_action :authenticate, only: [:create]

  protect_from_forgery with: :null_session

  def create
    klacht = Klacht.new(klacht_params)

    klacht.image.attach(params[:klacht][:image]) if params[:klacht][:image].present?

    if klacht.save
      render json: klacht, status: :created
    else
      render json: { errors: klacht.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def index
    klachten = Klacht.all
    render json: klachten
  end

  private

  def klacht_params
    params.require(:klacht).permit(:name, :description, :latitude, :longitude, :image)
  end
end
