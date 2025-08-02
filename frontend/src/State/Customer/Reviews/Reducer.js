import {
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAILURE,
  GET_REVIEWS_BY_RESTAURANT_REQUEST,
  GET_REVIEWS_BY_RESTAURANT_SUCCESS,
  GET_REVIEWS_BY_RESTAURANT_FAILURE,
  GET_REVIEWS_BY_USER_REQUEST,
  GET_REVIEWS_BY_USER_SUCCESS,
  GET_REVIEWS_BY_USER_FAILURE,
  UPDATE_REVIEW_REQUEST,
  UPDATE_REVIEW_SUCCESS,
  UPDATE_REVIEW_FAILURE,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAILURE,
  GET_REVIEW_BY_ORDER_ID_REQUEST,
  GET_REVIEW_BY_ORDER_ID_SUCCESS,
  GET_REVIEW_BY_ORDER_ID_FAILURE,
} from "./ActionType";

const initialState = {
  loading: false,
  reviews: [],
  userReviews: [],
  restaurantReviews: [],
  error: null,
  currentReview: null,
};

export const reviewReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_REVIEW_REQUEST:
    case UPDATE_REVIEW_REQUEST:
    case DELETE_REVIEW_REQUEST:
    case GET_REVIEWS_BY_USER_REQUEST:
    case GET_REVIEWS_BY_RESTAURANT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case GET_REVIEW_BY_ORDER_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        currentReview: null 
      };

    case GET_REVIEW_BY_ORDER_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        currentReview: payload
      };

    case GET_REVIEW_BY_ORDER_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
        currentReview: null
      };

    case CREATE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        reviews: [...state.reviews, payload],
        currentReview: payload
      };

    case GET_REVIEWS_BY_RESTAURANT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        restaurantReviews: payload
      };

    case GET_REVIEWS_BY_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        userReviews: payload
      };

    case UPDATE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        reviews: state.reviews.map(review =>
          review.id === payload.id ? payload : review
        ),
        currentReview: payload
      };

    case DELETE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        reviews: state.reviews.filter(review => review.id !== payload),
        currentReview: null
      };

    case CREATE_REVIEW_FAILURE:
    case UPDATE_REVIEW_FAILURE:
    case DELETE_REVIEW_FAILURE:
    case GET_REVIEWS_BY_USER_FAILURE:
    case GET_REVIEWS_BY_RESTAURANT_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      };

    default:
      return state;
  }
};

export default reviewReducer;