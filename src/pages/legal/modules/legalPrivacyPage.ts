import type { LegalPageContent } from "../types/LegalPageType";
import { legalContactEmail, legalUpdatedAt } from "./legalMeta";

export const legalPrivacyPage: LegalPageContent = {
  intro:
    "Chính sách này giải thích cách ứng dụng thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu khi bạn sử dụng Zalo Mini App ứng dụng.",
  kind: "privacy",
  sections: [
    {
      blocks: [
        {
          headers: ["Nhóm dữ liệu", "Ví dụ", "Mục đích"],
          rows: [
            [
              "Thông tin Zalo cơ bản",
              "Zalo User ID, tên hiển thị, ảnh đại diện nếu bạn cấp quyền",
              "Tạo hồ sơ người dùng và hiển thị thông tin cặp đôi",
            ],
            [
              "Dữ liệu cặp đôi",
              "Ngày bắt đầu, tiêu đề cặp đôi, vai trò, phía hiển thị",
              "Đếm ngày yêu nhau và hiển thị giao diện Home",
            ],
            [
              "Dữ liệu kỷ niệm",
              "Tên ngày kỷ niệm, ngày kỷ niệm, mô tả hoặc ghi chú",
              "Hiển thị danh sách kỷ niệm và mốc gần nhất",
            ],
            [
              "Dữ liệu lời mời",
              "Mã mời, trạng thái hiệu lực, thời gian tạo hoặc hết hạn",
              "Cho phép mời đối tác tham gia cặp đôi qua Zalo",
            ],
          ],
          type: "table",
        },
        {
          text: "ứng dụng không chủ động thu thập vị trí chính xác, danh bạ, tin nhắn riêng tư, thông tin thanh toán hoặc dữ liệu nhạy cảm ngoài phạm vi tính năng.",
          type: "paragraph",
        },
      ],
      title: "1. Dữ liệu chúng tôi thu thập",
    },
    {
      blocks: [
        {
          items: [
            "Xác định người dùng trong ứng dụng thông qua Zalo User ID.",
            "Hiển thị tên, ảnh đại diện và thông tin hai phía của cặp đôi.",
            "Tính toán số ngày yêu nhau dựa trên ngày bắt đầu.",
            "Tạo, hiển thị và quản lý danh sách ngày kỷ niệm.",
            "Tạo mã mời và xử lý việc tham gia cặp đôi qua invite code.",
          ],
          type: "list",
        },
      ],
      title: "2. Cách chúng tôi sử dụng dữ liệu",
    },
    {
      blocks: [
        {
          text: "Dữ liệu production của ứng dụng được lưu trữ bằng Supabase. Khi thiếu cấu hình Supabase, ứng dụng có thể dùng localStorage để phục vụ demo và phát triển.",
          type: "paragraph",
        },
        {
          text: "Chúng tôi dùng HTTPS, hạn chế quyền truy cập và không đưa khóa bí mật như Supabase Service Role Key hoặc Zalo App Secret vào mã nguồn frontend.",
          type: "paragraph",
        },
      ],
      title: "3. Lưu trữ và bảo mật",
    },
    {
      blocks: [
        {
          items: [
            "Zalo/Zalo Mini App Platform để cung cấp môi trường đăng nhập, cấp quyền và chia sẻ.",
            "Supabase để lưu trữ và vận hành cơ sở dữ liệu.",
            "Cơ quan có thẩm quyền khi có nghĩa vụ cung cấp theo quy định pháp luật.",
          ],
          type: "list",
        },
        {
          text: "ứng dụng không bán dữ liệu cá nhân của người dùng.",
          type: "notice",
        },
      ],
      title: "4. Chia sẻ dữ liệu",
    },
    {
      blocks: [
        {
          text: `Bạn có thể rút quyền trong Zalo Mini App, yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu qua ${legalContactEmail}, hoặc ngừng sử dụng ứng dụng bất kỳ lúc nào.`,
          type: "paragraph",
        },
      ],
      title: "5. Quyền của người dùng",
    },
  ],
  subtitle: "Cách ứng dụng xử lý và bảo vệ dữ liệu",
  title: "Chính sách quyền riêng tư",
  updatedAt: legalUpdatedAt,
};
