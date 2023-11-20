import { Session } from "@supabase/supabase-js"
import { Database } from "./db"

export type Page = { 
    session: Session, 
    userDetails: Database["public"]["Tables"]["users"]["Row"],
    userTeams: Database["public"]["Tables"]["teams_users"]["Row"],
    subscription: Database["public"]["Tables"]["subscriptions"]["Row"] & { 
      prices: Database["public"]["Tables"]["prices"]["Row"] & {
        products: Database["public"]["Tables"]["products"]["Row"],
      }
    }
  }