declare module '@react-native-camera-roll/camera-roll' {
  export interface GetPhotosParams {
    first: number;
    after?: string;
    assetType?: 'Photos' | 'Videos' | 'All';
  }

  export interface GetPhotosResult {
    edges: { node: { image: { uri: string } } }[];
    page_info: { has_next_page: boolean; end_cursor?: string };
  }

  export function getPhotos(params: GetPhotosParams): Promise<GetPhotosResult>;
}
