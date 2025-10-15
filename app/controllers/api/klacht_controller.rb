class Api::KlachtController < ApplicationController
  skip_before_action :authenticate
  protect_from_forgery with: :null_session 
  
  def create
    klacht = Klacht.new(body_params)

    if klacht.save
      render json: { status: "success", item: body_params}
    else 
      render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def body_params
    params.require(:klacht).permit(:name, :description, :latitude, :longitude)
  end 
end
