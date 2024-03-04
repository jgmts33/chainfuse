import { useCurrentUser } from "@chainfuse/react";
import React from "react";
import { atomFamily, useRecoilCallback, useRecoilValue } from "recoil";
import { auth } from "./firebase.js";

export const Hostname = atomFamily<Hostname | undefined, string | undefined>({
  key: "Hostname",
  async default(siteId) {
    if (!siteId) return undefined;
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) return undefined;
    const headers = new Headers({ authorization: `Bearer ${idToken}` });
    const res = await fetch(`/api/sites/${siteId}/hostname`, { headers });
    await res.json();
  },
});

export function useHostname(siteId: string | undefined) {
  const me = useCurrentUser();
  const value = useRecoilValue(Hostname(siteId));

  const refresh = useRecoilCallback(
    ({ set }) =>
      async () => {
        const idToken = await me?.getIdToken();
        if (siteId && idToken) {
          const headers = new Headers({ authorization: `Bearer ${idToken}` });
          const res = await fetch(`/api/sites/${siteId}/hostname`, { headers });
          set(Hostname(siteId), res.ok ? await res.json() : undefined);
        }
      },
    [siteId, me?.uid]
  );

  React.useEffect(() => {
    refresh();
    const interval = setInterval(() => {
      if (!document.hidden) refresh();
    }, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  return value;
}

type Hostname = {
  /**
   * Custom hostname identifier tag (`min length: 36`, `max length: 36`)
   * @example "0d89c70d-ad9f-4843-b99f-6cc0252067e9"
   */
  id: string;
  /**
   * Custom hostname that points to zone's hostname via CNAME (`max length: 255`)
   * @example "@app.example.com"
   */
  hostname: string;
  /**
   * Status of the hostname's activation.
   */
  status: "pending" | "active" | "moved" | "deleted";
  /**
   * These are errors that were encountered while trying to activate a hostname.
   */
  verification_errors: string[];
  /**
   * This is a record which can be placed to activate a hostname.
   */
  ownership_verification: {
    /**
     * DNS Record type
     */
    type: "txt";
    /**
     * DNS Name for record.
     * @example "_cf-custom-hostname.app.example.com"
     */
    name: string;
    /**
     * Content for the record.
     * @example "5cc07c04-ea62-4a5a-95f0-419334a875a4"
     */
    value: string;
  };
  /**
   * SSL properties for the custom hostname
   */
  ssl: {
    /**
     * Custom hostname SSL identifier tag (`min length: 36`, `max length: 36`)
     * @example "0d89c70d-ad9f-4843-b99f-6cc0252067e9"
     */
    id: string;
    /**
     * Status of the hostname's SSL certificates
     */
    status:
      | "initializing"
      | "pending_validation"
      | "pending_issuance"
      | "pending_deployment"
      | "active"
      | "pending_deletion"
      | "deleted";
    /**
     * Domain control validation (DCV) method used for this hostname.
     */
    method: "http" | "txt" | "email";
    /**
     * Level of validation to be used for this hostname. Domain validation (dv) must be used.
     */
    type: "dv";
    validation_records: Array<{
      txt_name: string;
      txt_value: string;
      http_url: string;
      http_body: string;
      emails: string[];
    }>;
    validation_errors: Array<{ message: string }>;
    hosts: string[];
    issuer: string;
    serial_number: string;
    signature: string;
    uploaded_on: string;
    expires_on: string;
    custom_csr_id: string;
    settings: Record<string, unknown>;
    bundle_method: "ubiquitous" | "optimal" | "force";
    wildcard: boolean;
    certificate_authority: "digicert" | "lets_encrypt";
    custom_certificate: string;
    custom_key: string;
  } | null;
};
