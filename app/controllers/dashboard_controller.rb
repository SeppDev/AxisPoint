# frozen_string_literal: true

class DashboardController < InertiaController
  def index
    # Provide basic dashboard statistics for authenticated users
    total = Klacht.count
    counts = Klacht.group(:status).count

    stats = {
      total: total,
      open: counts['open'] || 0,
      in_progress: counts['in_progress'] || 0,
      completed: counts['completed'] || 0
    }

    recent = Klacht.order(created_at: :desc).limit(5).as_json(only: %i[id name status created_at])

    render inertia: {
      stats: stats,
      recent: recent
    }
  end
end
