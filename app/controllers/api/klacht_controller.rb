# frozen_string_literal: true

class Api::KlachtController < ApplicationController
  before_action :authenticate, only: [:index, :destroy]
  skip_before_action :authenticate, only: [:create, :update]
  skip_before_action :verify_authenticity_token, only: [:create, :update]

  def create
    klacht = Klacht.new(klacht_params)

    klacht.image.attach(params[:klacht][:image]) if params[:klacht][:image].present?

    if klacht.save
      render json: { status: 'success' }
    else
      render json: { errors: klacht.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    klacht = Klacht.find_by(id: params[:id])
    return render json: { status: 'error' }, status: :not_found unless klacht

    if klacht.update(klacht_params)
      render json: { status: 'success' }
    else
      render json: { errors: klacht.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    klacht = Klacht.find_by(id: params[:id])
    if klacht
      klacht.destroy
      render json: { status: 'success' }
    else
      render json: { status: 'error' }, status: :not_found
    end
  end

  def index
    klachten = Klacht.all
    render json: klachten
  end

  private

  def klacht_params
  params.require(:klacht).permit(:name, :description, :latitude, :longitude, :image, :status, :contact_email)
  end
end
