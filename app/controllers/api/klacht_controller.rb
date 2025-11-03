# frozen_string_literal: true

class Api::KlachtController < ApplicationController
  before_action :authenticate, only: [:index, :delete]
  
  # Skip authentication for :create (POST)
  skip_before_action :authenticate, only: [:create]

  protect_from_forgery with: :null_session 
  
  def create
    klacht = Klacht.new(body_params)

    if klacht.save
      render json: { status: "success" }
    else 
      render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def delete
    render json: { status: "yo man" }
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
