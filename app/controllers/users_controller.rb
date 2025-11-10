# frozen_string_literal: true

class UsersController < InertiaController
  # skip_before_action :authenticate, only: %i[new create]
  # before_action :require_no_authentication, only: %i[new create]

  def index; end

  def destroy
    user = Current.user
    if user.authenticate(params[:password_challenge] || '')
      user.destroy!
      Current.session = nil
      redirect_to root_path, notice: 'Your account has been deleted', inertia: { clear_history: true }
    else
      redirect_to settings_profile_path, inertia: { errors: { password_challenge: 'Password challenge is invalid' } }
    end
  end
end
