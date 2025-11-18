import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import type { TripDetail } from "@/types/trip";
import { 
  fetchTripDetail, 
  fetchTripCoupons, 
  fetchTripPoints, 
  fetchTripRatings, 
  fetchTripPolicies, 
  fetchTripImages, 
  fetchTripExtensions 
} from "@/redux/thunks/tripDetailThunks";

interface TripDetailCache {
  [tripId: string]: {
    data?: TripDetail;
    coupons?: TripDetail['coupons'];
    points?: TripDetail['points'];
    rating?: TripDetail['rating'];
    policies?: {
      companyPolicies: TripDetail['companyPolicies'];
      cancellationRules: TripDetail['cancellationRules'];
    };
    images?: TripDetail['images'];
    extensions?: TripDetail['extensions'];
    loadedTabs: {
      coupons: boolean;
      points: boolean;
      rating: boolean;
      policies: boolean;
      images: boolean;
      extensions: boolean;
    };
  };
}

interface tripDetailState {
  cache: TripDetailCache;
  status: {
    [tripId: string]: {
      coupons: "idle" | "loading" | "succeeded" | "failed";
      points: "idle" | "loading" | "succeeded" | "failed";
      rating: "idle" | "loading" | "succeeded" | "failed";
      policies: "idle" | "loading" | "succeeded" | "failed";
      images: "idle" | "loading" | "succeeded" | "failed";
      extensions: "idle" | "loading" | "succeeded" | "failed";
      all: "idle" | "loading" | "succeeded" | "failed";
    };
  };
  error: string | null;
}

const initialState: tripDetailState = {
  cache: {},
  status: {},
  error: null,
};

const tripDetailSlice = createSlice({
  name: "tripDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch full trip detail (legacy)
    builder
      .addCase(fetchTripDetail.pending, (state, action) => {
        const tripId = action.meta.arg;
        if (!state.status[tripId]) {
          state.status[tripId] = {
            coupons: "idle",
            points: "idle",
            rating: "idle",
            policies: "idle",
            images: "idle",
            extensions: "idle",
            all: "loading",
          };
        } else {
          state.status[tripId].all = "loading";
        }
      })
      .addCase(fetchTripDetail.fulfilled, (state, action) => {
        const tripId = action.payload.tripId;
        state.cache[tripId] = {
          data: action.payload,
          coupons: action.payload.coupons,
          points: action.payload.points,
          rating: action.payload.rating,
          policies: {
            companyPolicies: action.payload.companyPolicies,
            cancellationRules: action.payload.cancellationRules,
          },
          images: action.payload.images,
          extensions: action.payload.extensions,
          loadedTabs: {
            coupons: true,
            points: true,
            rating: true,
            policies: true,
            images: true,
            extensions: true,
          },
        };
        state.status[tripId].all = "succeeded";
      })
      .addCase(fetchTripDetail.rejected, (state, action) => {
        const tripId = action.meta.arg;
        state.status[tripId].all = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải chi tiết chuyến đi: " + state.error);
      });

    // Fetch coupons
    builder
      .addCase(fetchTripCoupons.pending, (state, action) => {
        const tripId = action.meta.arg;
        if (!state.status[tripId]) {
          state.status[tripId] = {
            coupons: "loading",
            points: "idle",
            rating: "idle",
            policies: "idle",
            images: "idle",
            extensions: "idle",
            all: "idle",
          };
        } else {
          state.status[tripId].coupons = "loading";
        }
      })
      .addCase(fetchTripCoupons.fulfilled, (state, action) => {
        const tripId = action.payload.tripId;
        if (!state.cache[tripId]) {
          state.cache[tripId] = {
            loadedTabs: {
              coupons: false,
              points: false,
              rating: false,
              policies: false,
              images: false,
              extensions: false,
            },
          };
        }
        state.cache[tripId].coupons = action.payload.coupons;
        state.cache[tripId].loadedTabs.coupons = true;
        state.status[tripId].coupons = "succeeded";
      })
      .addCase(fetchTripCoupons.rejected, (state, action) => {
        const tripId = action.meta.arg;
        state.status[tripId].coupons = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải mã giảm giá");
      });

    // Fetch points
    builder
      .addCase(fetchTripPoints.pending, (state, action) => {
        const tripId = action.meta.arg;
        if (!state.status[tripId]) {
          state.status[tripId] = {
            coupons: "idle",
            points: "loading",
            rating: "idle",
            policies: "idle",
            images: "idle",
            extensions: "idle",
            all: "idle",
          };
        } else {
          state.status[tripId].points = "loading";
        }
      })
      .addCase(fetchTripPoints.fulfilled, (state, action) => {
        const tripId = action.payload.tripId;
        if (!state.cache[tripId]) {
          state.cache[tripId] = {
            loadedTabs: {
              coupons: false,
              points: false,
              rating: false,
              policies: false,
              images: false,
              extensions: false,
            },
          };
        }
        state.cache[tripId].points = action.payload.points;
        state.cache[tripId].loadedTabs.points = true;
        state.status[tripId].points = "succeeded";
      })
      .addCase(fetchTripPoints.rejected, (state, action) => {
        const tripId = action.meta.arg;
        state.status[tripId].points = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải điểm đón/trả");
      });

    // Fetch ratings
    builder
      .addCase(fetchTripRatings.pending, (state, action) => {
        const tripId = action.meta.arg.tripId;
        if (!state.status[tripId]) {
          state.status[tripId] = {
            coupons: "idle",
            points: "idle",
            rating: "loading",
            policies: "idle",
            images: "idle",
            extensions: "idle",
            all: "idle",
          };
        } else {
          state.status[tripId].rating = "loading";
        }
      })
      .addCase(fetchTripRatings.fulfilled, (state, action) => {
        const tripId = action.payload.tripId;
        if (!state.cache[tripId]) {
          state.cache[tripId] = {
            loadedTabs: {
              coupons: false,
              points: false,
              rating: false,
              policies: false,
              images: false,
              extensions: false,
            },
          };
        }
        // Always update rating data (don't use cache for ratings due to filters/pagination)
        state.cache[tripId].rating = action.payload.rating;
        state.cache[tripId].loadedTabs.rating = true;
        state.status[tripId].rating = "succeeded";
      })
      .addCase(fetchTripRatings.rejected, (state, action) => {
        const tripId = action.meta.arg.tripId;
        state.status[tripId].rating = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải đánh giá");
      });

    // Fetch policies
    builder
      .addCase(fetchTripPolicies.pending, (state, action) => {
        const tripId = action.meta.arg;
        if (!state.status[tripId]) {
          state.status[tripId] = {
            coupons: "idle",
            points: "idle",
            rating: "idle",
            policies: "loading",
            images: "idle",
            extensions: "idle",
            all: "idle",
          };
        } else {
          state.status[tripId].policies = "loading";
        }
      })
      .addCase(fetchTripPolicies.fulfilled, (state, action) => {
        const tripId = action.payload.tripId;
        if (!state.cache[tripId]) {
          state.cache[tripId] = {
            loadedTabs: {
              coupons: false,
              points: false,
              rating: false,
              policies: false,
              images: false,
              extensions: false,
            },
          };
        }
        state.cache[tripId].policies = {
          companyPolicies: action.payload.companyPolicies,
          cancellationRules: action.payload.cancellationRules,
        };
        state.cache[tripId].loadedTabs.policies = true;
        state.status[tripId].policies = "succeeded";
      })
      .addCase(fetchTripPolicies.rejected, (state, action) => {
        const tripId = action.meta.arg;
        state.status[tripId].policies = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải chính sách");
      });

    // Fetch images
    builder
      .addCase(fetchTripImages.pending, (state, action) => {
        const tripId = action.meta.arg;
        if (!state.status[tripId]) {
          state.status[tripId] = {
            coupons: "idle",
            points: "idle",
            rating: "idle",
            policies: "idle",
            images: "loading",
            extensions: "idle",
            all: "idle",
          };
        } else {
          state.status[tripId].images = "loading";
        }
      })
      .addCase(fetchTripImages.fulfilled, (state, action) => {
        const tripId = action.payload.tripId;
        if (!state.cache[tripId]) {
          state.cache[tripId] = {
            loadedTabs: {
              coupons: false,
              points: false,
              rating: false,
              policies: false,
              images: false,
              extensions: false,
            },
          };
        }
        state.cache[tripId].images = action.payload.images;
        state.cache[tripId].loadedTabs.images = true;
        state.status[tripId].images = "succeeded";
      })
      .addCase(fetchTripImages.rejected, (state, action) => {
        const tripId = action.meta.arg;
        state.status[tripId].images = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải hình ảnh");
      });

    // Fetch extensions
    builder
      .addCase(fetchTripExtensions.pending, (state, action) => {
        const tripId = action.meta.arg;
        if (!state.status[tripId]) {
          state.status[tripId] = {
            coupons: "idle",
            points: "idle",
            rating: "idle",
            policies: "idle",
            images: "idle",
            extensions: "loading",
            all: "idle",
          };
        } else {
          state.status[tripId].extensions = "loading";
        }
      })
      .addCase(fetchTripExtensions.fulfilled, (state, action) => {
        const tripId = action.payload.tripId;
        if (!state.cache[tripId]) {
          state.cache[tripId] = {
            loadedTabs: {
              coupons: false,
              points: false,
              rating: false,
              policies: false,
              images: false,
              extensions: false,
            },
          };
        }
        state.cache[tripId].extensions = action.payload.extensions;
        state.cache[tripId].loadedTabs.extensions = true;
        state.status[tripId].extensions = "succeeded";
      })
      .addCase(fetchTripExtensions.rejected, (state, action) => {
        const tripId = action.meta.arg;
        state.status[tripId].extensions = "failed";
        state.error = action.error.message ?? null;
        toast.error("Lỗi khi tải tiện ích");
      });
  },
});

export default tripDetailSlice.reducer;
