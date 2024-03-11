import { HttpError } from "../errorHandler";
import availableActions from "../roles/availableActions";

const allow = async (
  request: NextRequest,
  actions: typeof availableActions
) => {
  const loggedInUser = request.user;
  if (!loggedInUser) {
    throw new HttpError(401, "Unauthorized");
  }

  if (!loggedInUser.role) {
    throw new HttpError(403, "Forbidden");
  }

  if (
    !loggedInUser.role.actions.some((action: string) =>
      actions.includes(action)
    )
  ) {
    throw new HttpError(403, "Forbidden");
  }
};

export default allow;
